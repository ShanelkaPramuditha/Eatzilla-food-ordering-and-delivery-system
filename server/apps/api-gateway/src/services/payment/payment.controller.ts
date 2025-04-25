import { Body, Controller, Get, Post } from '@nestjs/common';
import { CheckoutPayload, PaymentService } from './payment.service';
import { Public } from '../../auth/decorator/public.decorator';

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

  @Public()
  @Post('checkout')
  checkout(@Body() checkoutDto: CheckoutPayload[]) {
    return this.paymentService.checkout(checkoutDto);
  }
}
