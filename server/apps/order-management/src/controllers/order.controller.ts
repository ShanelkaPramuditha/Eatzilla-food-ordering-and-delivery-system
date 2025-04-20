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
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto, UpdateOrderStatusDto, CancelOrderDto } from '../dtos/update-order.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Order, OrderStatus } from '../schemas/order.schema';
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
    type: Order,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid order data' })
  @ApiBody({ type: CreateOrderDto })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: { user: { _id: string } },
  ): Promise<Order> {
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
    type: [Order],
  })
  async getMyOrders(@Request() req: { user: { _id: string } }): Promise<Order[]> {
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
    type: Order,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async getOrder(@Param('id') id: string): Promise<Order> {
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
    type: Order,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Order cannot be modified' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Post(':id/cancel')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: CancelOrderDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order cancelled successfully',
    type: Order,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Order cannot be cancelled' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async cancelOrder(
    @Param('id') id: string,
    @Body() cancelOrderDto: CancelOrderDto,
  ): Promise<Order> {
    return this.orderService.cancelOrder(id, cancelOrderDto.reason);
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
    type: [Order],
  })
  async getRestaurantOrders(@Param('restaurantId') restaurantId: string): Promise<Order[]> {
    return this.orderService.findByRestaurant(restaurantId);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER, UserRole.DELIVERY_PERSON)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order status updated successfully',
    type: Order,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid status transition' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.orderService.updateStatus(id, updateStatusDto);
  }

  // Admin endpoints
  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by order status' })
  @ApiQuery({ name: 'restaurantId', required: false, description: 'Filter by restaurant ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Orders retrieved successfully',
    type: [Order],
  })
  async getAllOrders(
    @Query('status') status?: string,
    @Query('restaurantId') restaurantId?: string,
  ): Promise<Order[]> {
    const filters: { status?: string; restaurantId?: string } = {};
    if (status) filters.status = status;
    if (restaurantId) filters.restaurantId = restaurantId;

    return this.orderService.findAll(filters);
  }

  // Microservice message patterns
  @MessagePattern('payment.completed')
  async handlePaymentCompleted(
    @Payload() data: { orderId: string; paymentId: string },
  ): Promise<void> {
    await this.orderService.updateStatus(data.orderId, {
      status: 'payment_completed' as OrderStatus.PAYMENT_COMPLETED,
      note: `Payment completed with ID: ${data.paymentId}`,
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

    order.deliveryPersonId = new Types.ObjectId(data.deliveryPersonId);
    await order.save();
  }
}
