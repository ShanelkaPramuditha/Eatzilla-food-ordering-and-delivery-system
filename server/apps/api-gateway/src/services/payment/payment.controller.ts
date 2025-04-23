import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getStatus() {
    return this.paymentService.getStatus();
  }

  @Get('products')
  getProducts() {
    return this.paymentService.getProducts();
  }
}
