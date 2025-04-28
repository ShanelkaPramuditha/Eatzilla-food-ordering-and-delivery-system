import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Microservice } from '../../constants/microservice';
import { CheckoutPayload } from '@app/common/types/payment';
import { PaymentSessionDto } from '@app/common/dtos/transaction.dto';
import { catchRpcError } from '../../filters/rpc-exception.filter';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(Microservice.PAYMENT_SERVICE)
    private readonly paymentClient: ClientProxy,
  ) {}

  getStatus() {
    return this.paymentClient
      .send({ cmd: 'get.status' }, {})
      .pipe(catchRpcError('Failed to get payment service status'));
  }

  createTransaction(payload: PaymentSessionDto) {
    return this.paymentClient
      .send({ cmd: 'payment.createTransaction' }, payload)
      .pipe(catchRpcError('Failed to create transaction'));
  }

  checkout(payload: CheckoutPayload) {
    return this.paymentClient
      .send({ cmd: 'post.checkout' }, payload)
      .pipe(catchRpcError('Failed to process checkout'));
  }

  getSessionStatus(sessionId: string) {
    return this.paymentClient
      .send({ cmd: 'get.sessionStatus' }, sessionId)
      .pipe(catchRpcError('Failed to get session status'));
  }

  getReceiptUrl(sessionId: string) {
    return this.paymentClient
      .send({ cmd: 'get.receipt' }, sessionId)
      .pipe(catchRpcError('Failed to get receipt URL'));
  }

  getTransactionByOrderId(orderId: string) {
    return this.paymentClient
      .send({ cmd: 'payment.getTransactionByOrderId' }, orderId)
      .pipe(catchRpcError('Failed to get transaction by order ID'));
  }

  getTransactionBySessionId(sessionId: string) {
    return this.paymentClient
      .send({ cmd: 'payment.getTransactionBySessionId' }, sessionId)
      .pipe(catchRpcError('Failed to get transaction by session ID'));
  }
}
