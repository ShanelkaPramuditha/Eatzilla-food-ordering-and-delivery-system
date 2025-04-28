import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from '../../auth/decorator/public.decorator';
import { CheckoutPayload } from '@app/common/types/payment';
import { PaymentSessionDto } from '@app/common/dtos/transaction.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getStatus() {
    return this.paymentService.getStatus();
  }

  @Post()
  createTransaction(@Body() payload: PaymentSessionDto) {
    return this.paymentService.createTransaction(payload);
  }

  @Public()
  @Post('checkout')
  checkout(@Body() checkoutDto: CheckoutPayload) {
    return this.paymentService.checkout(checkoutDto);
  }

  @Get('session-status/:session_id')
  getSessionStatus(@Param('session_id') sessionId: string) {
    return this.paymentService.getSessionStatus(sessionId);
  }

  @Public()
  @Get('receipt/:sessionId')
  getReceiptUrl(@Param('sessionId') sessionId: string) {
    return this.paymentService.getReceiptUrl(sessionId);
  }

  @Get('transaction/order/:orderId')
  getTransactionByOrderId(@Param('orderId') orderId: string) {
    return this.paymentService.getTransactionByOrderId(orderId);
  }

  @Get('transaction/session/:sessionId')
  getTransactionBySessionId(@Param('sessionId') sessionId: string) {
    return this.paymentService.getTransactionBySessionId(sessionId);
  }
}
