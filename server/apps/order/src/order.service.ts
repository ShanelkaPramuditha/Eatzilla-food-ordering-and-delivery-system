import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Address, Order, OrderDocument, OrderItem, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderDto, UpdateSuborderStatusDto } from './dtos/order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  getStatus(): string {
    return 'Order service is running';
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    // Convert string IDs to ObjectIds
    const customerId = new Types.ObjectId(createOrderDto.customerId);

    const suborders = createOrderDto.suborders.map((suborder) => ({
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
      deliveryAddress: createOrderDto.deliveryAddress,
      paymentMethod: createOrderDto.paymentMethod,
      paymentId: createOrderDto.paymentId,
      specialInstructions: createOrderDto.specialInstructions,
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

  async findAllByRestaurant(restaurantId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({
        'suborders.restaurantId': new Types.ObjectId(restaurantId),
      })
      .exec();
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
    updateSuborderStatusDto: UpdateSuborderStatusDto,
  ): Promise<OrderDocument> {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    const suborderIndex = order.suborders.findIndex(
      (suborder) => suborder._id.toString() === suborderId,
    );

    if (suborderIndex === -1) {
      throw new Error('Suborder not found');
    }

    // Update the suborder status
    order.suborders[suborderIndex].status = updateSuborderStatusDto.status;

    // Check if all suborders have the same status
    const allSameStatus = order.suborders.every(
      (suborder) => suborder.status === updateSuborderStatusDto.status,
    );

    // If all suborders have the same status, update the main order status
    if (allSameStatus) {
      order.status = updateSuborderStatusDto.status;
    }

    return order.save();
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
}
