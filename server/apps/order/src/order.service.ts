import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Address, Order, OrderDocument, OrderItem } from './schemas/order.schema';
import { CreateOrderDto, OrderStatus, UpdateOrderDto } from '@app/common/dtos/order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  getStatus(): string {
    return 'Order service is running';
  }

  async create(req: { dto: CreateOrderDto; userId: string }): Promise<OrderDocument> {
    console.log('Creating order with DTO:', req);
    const customerId = new Types.ObjectId(req.userId);

    const suborders = req.dto.suborders.map((suborder) => ({
      ...suborder,
      restaurantId: new Types.ObjectId(suborder.restaurantId),
      items: suborder.items.map((item) => ({
        ...item,
        menuItemId: new Types.ObjectId(item.menuItemId),
      })),
    }));

    // Create the order
    const newOrder = new this.orderModel({
      customerId,
      suborders,
      deliveryAddress: req.dto.deliveryAddress,
      paymentMethod: req.dto.paymentMethod,
      paymentId: req.dto.paymentId,
      customerPhoneNumber: req.dto.customerPhoneNumber,
      specialInstructions: req.dto.specialInstructions,
      status: OrderStatus.CREATED,
      isPaid: false,
    });

    return await newOrder.save();
  }

  async findAll(): Promise<OrderDocument[]> {
    return this.orderModel.find().exec();
  }

  async findAllByCustomer(customerId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({
        customerId: new Types.ObjectId(customerId),
      })
      .exec();
  }

  async findAllByRestaurant(restaurantId: string): Promise<any[]> {
    const objectId = new Types.ObjectId(restaurantId);

    const orders = await this.orderModel
      .find({
        'suborders.restaurantId': objectId,
      })
      .sort({ createdAt: -1 })
      .exec();

    return orders.map((order) => {
      const filteredSuborders = order.suborders.filter(
        (suborder) => suborder.restaurantId.toString() === objectId.toString(),
      );

      return {
        _id: order._id,
        customerId: order.customerId,
        suborders: filteredSuborders,
        currency: order.currency,
        deliveryAddress: order.deliveryAddress,
        status: order.status,
        isPaid: order.isPaid,
        specialInstructions: order.specialInstructions,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderDocument> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { $set: updateOrderDto }, { new: true })
      .exec();
    if (!updatedOrder) {
      throw new Error('Order not found');
    }
    return updatedOrder;
  }

  async updateSuborderStatus(
    orderId: string,
    suborderId: string,
    status: OrderStatus,
  ): Promise<{ message: string }> {
    try {
      const orderObjectId = new Types.ObjectId(orderId);

      const order = await this.orderModel.findById(orderObjectId);

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      const suborder = order.suborders.find((sub) => sub._id.toString() === suborderId);

      if (!suborder) {
        throw new NotFoundException(`Suborder with ID ${suborderId} not found in order ${orderId}`);
      }

      suborder.status = status;

      const statusHierarchy = [
        OrderStatus.CREATED,
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.READY_FOR_PICKUP,
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.DELIVERED,
      ];

      if (status === OrderStatus.CANCELLED) {
        const allCancelled = order.suborders.every((sub) => sub.status === OrderStatus.CANCELLED);
        if (allCancelled) {
          order.status = OrderStatus.CANCELLED;
        }
      } else {
        const minStatusIndex = Math.min(
          ...order.suborders.map((sub) => statusHierarchy.indexOf(sub.status)),
        );

        order.status = statusHierarchy[minStatusIndex];
      }

      await order.save();
      return {
        message: 'Suborder status updated successfully',
      };
    } catch (error) {
      console.log('Error updating suborder status:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error && error.name === 'CastError') {
        throw new BadRequestException('Invalid ID format');
      }
      throw new InternalServerErrorException('Failed to update suborder status');
    }
  }

  async cancelOrder(id: string): Promise<OrderDocument> {
    const orderObjectId = new Types.ObjectId(id);
    const order = await this.orderModel.findById(orderObjectId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.status = OrderStatus.CANCELLED;

    order.suborders.forEach((suborder) => {
      suborder.status = OrderStatus.CANCELLED;
    });

    await order.save();

    return order;
  }

  async getOrdersByStatus(status: OrderStatus): Promise<OrderDocument[]> {
    return this.orderModel.find({ status }).exec();
  }

  async setPaymentCompleted(orderId: string, paymentId: string): Promise<{ message: string }> {
    const orderObjectId = new Types.ObjectId(orderId);
    const order = await this.orderModel.findById(orderObjectId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    order.isPaid = true;
    order.paymentId = paymentId;

    await order.save();

    return { message: 'success' };
  }
  async updatePaymentStatus(orderId: string, isPaid: boolean): Promise<OrderDocument> {
    try {
      const orderObjectId = Types.ObjectId.isValid(orderId) ? new Types.ObjectId(orderId) : orderId;

      const currentOrder = await this.orderModel.findById(orderObjectId).exec();

      if (!currentOrder) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      const shouldUpdateStatus =
        isPaid && [OrderStatus.CREATED, 'pending_payment'].includes(currentOrder.status);

      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(
          orderObjectId,
          {
            $set: {
              isPaid,
              ...(shouldUpdateStatus ? { status: OrderStatus.CONFIRMED } : {}),
            },
          },
          { new: true },
        )
        .exec();

      if (!updatedOrder) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      return updatedOrder;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error && error.name === 'CastError') {
        throw new BadRequestException('Invalid ID format');
      }
      throw new InternalServerErrorException(
        `Failed to update payment status: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
