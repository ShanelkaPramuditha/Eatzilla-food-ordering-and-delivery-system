import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateSuborderStatusDto,
  OrderResponseDto,
} from '../dtos/create-order.dto';
import { OrderStatus } from '../schemas/order.schema';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../interfaces/user.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Customer endpoints
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid order data' })
  @ApiBody({ type: CreateOrderDto })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: { user: { _id: string } },
  ): Promise<OrderResponseDto> {
    // If customerId is not provided, use the authenticated user's ID
    if (!createOrderDto.customerId) {
      createOrderDto.customerId = req.user._id.toString();
    }
    return this.orderService.create(createOrderDto);
  }

  @Get('my-orders')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders for the authenticated customer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders retrieved successfully',
    type: [OrderResponseDto],
  })
  async getMyOrders(@Request() req: { user: { _id: string } }): Promise<OrderResponseDto[]> {
    return this.orderService.findByCustomer(req.user._id.toString());
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order retrieved successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async getOrder(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order updated successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Order cannot be modified' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order cancelled successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Order cannot be cancelled' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async cancelOrder(@Param('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.updateStatus(id, { status: OrderStatus.CANCELLED });
  }

  // Restaurant endpoints
  @Get('restaurant/:restaurantId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders for a restaurant' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders retrieved successfully',
    type: [OrderResponseDto],
  })
  async getRestaurantOrders(
    @Param('restaurantId') restaurantId: string,
  ): Promise<OrderResponseDto[]> {
    return this.orderService.findByRestaurant(restaurantId);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER, UserRole.DELIVERY_PERSON)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateSuborderStatusDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order status updated successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid status transition' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateSuborderStatusDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.updateStatus(id, updateStatusDto);
  }

  // Admin endpoints
  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by order status',
    enum: OrderStatus,
  })
  @ApiQuery({ name: 'restaurantId', required: false, description: 'Filter by restaurant ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders retrieved successfully',
    type: [OrderResponseDto],
  })
  async getAllOrders(
    @Query('status') status?: OrderStatus,
    @Query('restaurantId') restaurantId?: string,
  ): Promise<OrderResponseDto[]> {
    const filters: { status?: OrderStatus; restaurantId?: string } = {};
    if (status) filters.status = status;
    if (restaurantId) filters.restaurantId = restaurantId;

    return this.orderService.findAll(filters);
  }

  // Microservice message patterns
  @MessagePattern('payment.completed')
  async handlePaymentCompleted(
    @Payload() data: { orderId: string; paymentId: string },
  ): Promise<void> {
    await this.orderService.update(data.orderId, {
      isPaid: true,
      paymentId: data.paymentId,
      status: OrderStatus.CONFIRMED,
    });
  }

  @MessagePattern('delivery.assigned')
  async handleDeliveryAssigned(
    @Payload() data: { orderId: string; deliveryPersonId: string },
  ): Promise<void> {
    if (!data.deliveryPersonId || !Types.ObjectId.isValid(data.deliveryPersonId)) {
      throw new Error('Invalid delivery person ID');
    }

    const order = await this.orderService.findOne(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    await this.orderService.update(data.orderId, {
      deliveryPersonId: new Types.ObjectId(data.deliveryPersonId).toString(),
      status: OrderStatus.OUT_FOR_DELIVERY,
    });
  }
}
