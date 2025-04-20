import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from '../schemas/order.schema';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto, UpdateOrderStatusDto } from '../dtos/update-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CancelOrderDto } from '../dtos/cancel-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @Inject('RESTAURANT_SERVICE') private readonly restaurantClient: ClientProxy,
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
    @Inject('DELIVERY_SERVICE') private readonly deliveryClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      // Convert string ID to ObjectId
      const customerId = new Types.ObjectId(createOrderDto.customerId);

      // Validate restaurant and menu items with Restaurant Service
      const validationResult = await this.validateOrderItems(
        createOrderDto.restaurantId,
        createOrderDto.items,
      );

      if (!validationResult.valid) {
        throw new BadRequestException(validationResult.message);
      }

      // Create new order
      const newOrder = new this.orderModel({
        ...createOrderDto,
        customerId,
        status: OrderStatus.CREATED,
        isModifiable: true,
      });

      const savedOrder = await newOrder.save();

      // Notify restaurant about new order
      this.restaurantClient.emit('order.created', {
        orderId: savedOrder._id,
        restaurantId: savedOrder.restaurantId,
        items: savedOrder.items,
        total: savedOrder.total,
      });

      return savedOrder;
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findAll(filters: any = {}): Promise<Order[]> {
    return this.orderModel.find(filters).sort({ createdAt: -1 }).exec();
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    return this.orderModel
      .find({ customerId: new Types.ObjectId(customerId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByRestaurant(restaurantId: string): Promise<Order[]> {
    return this.orderModel.find({ restaurantId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    // Check if order can be modified
    if (!order.isModifiable) {
      throw new BadRequestException('This order can no longer be modified');
    }

    // If updating items, validate with restaurant service
    if (updateOrderDto.items) {
      const validationResult = await this.validateOrderItems(
        order.restaurantId,
        updateOrderDto.items,
      );

      if (!validationResult.valid) {
        throw new BadRequestException(validationResult.message);
      }
    }

    // Convert customerId if provided
    if (updateOrderDto.customerId) {
      updateOrderDto.customerId = new Types.ObjectId(updateOrderDto.customerId).toHexString();
    }

    // Update order with new data
    Object.assign(order, updateOrderDto);
    return order.save();
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    const previousStatus = order.status;

    // Validate status transition
    this.validateStatusTransition(previousStatus, updateStatusDto.status);

    // Update order status
    order.status = updateStatusDto.status;

    // Add note to status history if provided
    if (updateStatusDto.note) {
      order.statusHistory.push({
        status: updateStatusDto.status,
        timestamp: new Date(),
        note: updateStatusDto.note,
      });
    }

    // Handle status-specific actions
    await this.handleStatusChange(order, previousStatus, updateStatusDto.status);

    return order.save();
  }

  async cancelOrder(id: string, cancelOrderDto: CancelOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    // Check if order can be cancelled
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException(`Cannot cancel order in ${order.status} status`);
    }

    // Update status to cancelled
    order.status = OrderStatus.CANCELLED;
    order.statusHistory.push({
      status: OrderStatus.CANCELLED,
      timestamp: new Date(),
      note: cancelOrderDto.reason,
    });

    // If payment was made, initiate refund process
    if (order.isPaid && order.paymentId) {
      this.paymentClient.emit('payment.refund.request', {
        orderId: order._id,
        paymentId: order.paymentId,
        amount: order.total,
      });
    }

    // Notify relevant services
    this.notificationClient.emit('order.cancelled', {
      orderId: order._id,
      customerId: order.customerId,
      restaurantId: order.restaurantId,
      reason: cancelOrderDto.reason,
    });

    return order.save();
  }

  private async validateOrderItems(
    restaurantId: string,
    items: { menuItemId: string; quantity: number }[],
  ): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await this.restaurantClient
        .send('validate.menu.items', {
          restaurantId,
          items: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        })
        .toPromise();

      return response || { valid: true, message: 'All items are valid' };
    } catch (error) {
      return { valid: false, message: 'Failed to validate order items' };
    }
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const validTransitions = {
      [OrderStatus.CREATED]: [OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED],
      [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAYMENT_COMPLETED, OrderStatus.CANCELLED],
      [OrderStatus.PAYMENT_COMPLETED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED],
      [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELLED],
      [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(`Cannot transition from ${currentStatus} to ${newStatus}`);
    }
  }

  private async handleStatusChange(
    order: Order,
    previousStatus: OrderStatus,
    newStatus: OrderStatus,
  ): Promise<void> {
    switch (newStatus) {
      case OrderStatus.PENDING_PAYMENT:
        this.paymentClient.emit('payment.request', {
          orderId: order._id,
          customerId: order.customerId,
          amount: order.total,
          paymentMethod: order.paymentMethod,
        });
        break;

      case OrderStatus.PAYMENT_COMPLETED:
        order.isPaid = true;
        break;

      case OrderStatus.CONFIRMED:
        this.restaurantClient.emit('order.confirmed', {
          orderId: order._id,
          restaurantId: order.restaurantId,
        });
        break;

      case OrderStatus.READY_FOR_PICKUP:
        this.deliveryClient.emit('delivery.request', {
          orderId: order._id,
          restaurantId: order.restaurantId,
          deliveryAddress: order.deliveryAddress,
        });
        break;

      case OrderStatus.DELIVERED:
        this.notificationClient.emit('order.delivered', {
          orderId: order._id,
          customerId: order.customerId,
        });
        break;
    }
  }
}
