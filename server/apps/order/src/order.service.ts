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
    // Convert string IDs to ObjectIds
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
      specialInstructions: req.dto.specialInstructions,
      status: OrderStatus.CREATED,
      isPaid: false,
    });

    // Save will trigger the pre-save hook that calculates totals
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

    // Find all orders with suborders for this restaurant
    const orders = await this.orderModel
      .find({
        'suborders.restaurantId': objectId,
      })
      .sort({ createdAt: -1 })
      .exec();

    // Transform orders to include only necessary fields
    return orders.map((order) => {
      // Get only the suborders for this restaurant
      const filteredSuborders = order.suborders.filter(
        (suborder) => suborder.restaurantId.toString() === objectId.toString(),
      );

      // Return a simplified order object
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
  ): Promise<OrderDocument> {
    console.log('Updating suborder status:', { orderId, suborderId, status });
    try {
      // Convert string IDs to ObjectId
      const orderObjectId = new Types.ObjectId(orderId);

      // Find the order by ID
      const order = await this.orderModel.findById(orderObjectId);

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      // Find the suborder by ID
      const suborder = order.suborders.find((sub) => sub._id.toString() === suborderId);

      if (!suborder) {
        throw new NotFoundException(`Suborder with ID ${suborderId} not found in order ${orderId}`);
      }

      // Update the suborder status
      suborder.status = status;

      // Check if all suborders have the same status
      const allSameStatus = order.suborders.every((sub) => sub.status === status);

      // Update the main order status if all suborders match
      if (allSameStatus) {
        order.status = status;
      }

      // Save and return the updated order
      await order.save();
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error && error.name === 'CastError') {
        throw new BadRequestException('Invalid ID format');
      }
      throw new InternalServerErrorException('Failed to update suborder status');
    }
  }

  async remove(id: string): Promise<OrderDocument> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder) {
      throw new Error('Order not found');
    }
    return deletedOrder;
  }

  async getOrdersByStatus(status: OrderStatus): Promise<OrderDocument[]> {
    return this.orderModel.find({ status }).exec();
  }

  async getRestaurantSuborders(restaurantId: string, status?: OrderStatus): Promise<any[]> {
    const query: any = { 'suborders.restaurantId': new Types.ObjectId(restaurantId) };

    if (status) {
      query['suborders.status'] = status;
    }

    const orders = await this.orderModel.find(query).exec();

    // Extract and flatten the relevant suborders
    const suborders: {
      orderId: Types.ObjectId;
      suborderId: Types.ObjectId;
      customerInfo: {
        customerId: Types.ObjectId;
        deliveryAddress: Address;
      };
      items: OrderItem[];
      subtotal: number;
      status: OrderStatus;
      createdAt: Date;
    }[] = [];

    for (const order of orders) {
      const relevantSuborders = order.suborders.filter(
        (suborder) =>
          suborder.restaurantId.toString() === restaurantId &&
          (!status || suborder.status === status),
      );

      for (const suborder of relevantSuborders) {
        suborders.push({
          orderId: order._id,
          suborderId: suborder._id,
          customerInfo: {
            customerId: order.customerId,
            deliveryAddress: order.deliveryAddress,
          },
          items: suborder.items,
          subtotal: suborder.subtotal,
          status: suborder.status,
          createdAt: order.createdAt,
        });
      }
    }

    return suborders;
  }

  async updatePaymentStatus(orderId: string, isPaid: boolean): Promise<OrderDocument> {
    try {
      // Convert string ID to ObjectId if necessary
      const orderObjectId = Types.ObjectId.isValid(orderId) ? new Types.ObjectId(orderId) : orderId;

      // First, find the order to check its current status
      const currentOrder = await this.orderModel.findById(orderObjectId).exec();

      if (!currentOrder) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      // Determine if we should update the status based on current status and payment
      const shouldUpdateStatus =
        isPaid && [OrderStatus.CREATED, 'pending_payment'].includes(currentOrder.status);

      // Now update the order
      const updatedOrder = await this.orderModel
        .findByIdAndUpdate(
          orderObjectId,
          {
            $set: {
              isPaid,
              // Update status to CONFIRMED if needed
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
