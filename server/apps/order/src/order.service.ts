
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { OrderStatus } from './schemas/order.schema';
import {
  CreateOrderDto,
  OrderResponseDto,
  UpdateOrderDto,
  UpdateSuborderStatusDto,
} from './dtos/create-order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}
  getStatus(): string {
    return 'Order service is running';
  }
  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const deliveryFee = 5.99; // Example fixed delivery fee

    // Create the order
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      deliveryFee,
      status: OrderStatus.CREATED,
      isPaid: false,
    });

    const order = await createdOrder.save();
    return this.mapToResponseDto(order);
  }

  async findByCustomer(customerId: string): Promise<OrderResponseDto[]> {
    if (!Types.ObjectId.isValid(customerId)) {
      throw new BadRequestException('Invalid customer ID');
    }

    const orders = await this.orderModel.find({ customerId }).exec();
    return orders.map((order) => this.mapToResponseDto(order));
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.mapToResponseDto(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderModel
      .findByIdAndUpdate(id, { $set: updateOrderDto }, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.mapToResponseDto(order);
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateSuborderStatusDto,
  ): Promise<OrderResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const validStatusTransitions = {
      [OrderStatus.CREATED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY_FOR_PICKUP],
      [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.OUT_FOR_DELIVERY],
      [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
    };

    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (updateStatusDto.status === OrderStatus.CANCELLED) {
      if (order.status !== OrderStatus.CREATED && order.status !== OrderStatus.CONFIRMED) {
        throw new BadRequestException('Order can only be cancelled in CREATED or CONFIRMED status');
      }
    } else if (!validStatusTransitions[order.status]?.includes(updateStatusDto.status)) {
      throw new BadRequestException(
        `Invalid status transition from ${order.status} to ${updateStatusDto.status}`,
      );
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { status: updateStatusDto.status }, { new: true })
      .exec();

    return this.mapToResponseDto(updatedOrder!);
  }

  async findByRestaurant(restaurantId: string): Promise<OrderResponseDto[]> {
    if (!Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestException('Invalid restaurant ID');
    }

    const orders = await this.orderModel
      .find({
        'suborders.restaurantId': restaurantId,
      })
      .exec();

    return orders.map((order) => this.mapToResponseDto(order));
  }

  async findAll(filters: {
    status?: OrderStatus;
    restaurantId?: string;
  }): Promise<OrderResponseDto[]> {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.restaurantId) {
      if (!Types.ObjectId.isValid(filters.restaurantId)) {
        throw new BadRequestException('Invalid restaurant ID');
      }
      query['suborders.restaurantId'] = filters.restaurantId;
    }

    const orders = await this.orderModel.find(query).exec();
    return orders.map((order) => this.mapToResponseDto(order));
  }

  private mapToResponseDto(order: OrderDocument): OrderResponseDto {
    return {
      _id: order._id.toString(),
      customerId: order.customerId.toString(),
      suborders: order.suborders.map((suborder) => ({
        restaurantId: suborder.restaurantId.toString(),
        items: suborder.items,
        subtotal: suborder.subtotal,
        status: suborder.status,
      })),
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod || '',
      isPaid: order.isPaid,
      paymentId: order.paymentId,
      specialInstructions: order.specialInstructions,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      tax: order.tax,
      total: order.total,
    };
  }
}
