import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from '../../auth/decorator/public.decorator';

interface CheckoutDto {
  priceId?: string;
  quantity?: number;
}

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
  checkout(@Body() checkoutDto: CheckoutDto) {
    return this.paymentService.checkout(checkoutDto);
  }
}
