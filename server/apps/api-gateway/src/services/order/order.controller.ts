import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { Public } from '../../auth/decorator/public.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Get()
  getStatus() {
    return this.orderService.getStatus();
  }
}
