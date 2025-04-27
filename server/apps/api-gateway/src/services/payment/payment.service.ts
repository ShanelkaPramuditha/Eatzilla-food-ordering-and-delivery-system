import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Microservice } from '../../constants/microservice';
import { CheckoutPayload } from '@app/common/types/payment';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(Microservice.PAYMENT_SERVICE)
    private readonly paymentClient: ClientProxy,
  ) {}

  getStatus() {
    return this.paymentClient.send({ cmd: 'get.status' }, {});
  }

  getProducts() {
    return this.paymentClient.send({ cmd: 'get.products' }, {});
  }

  checkout(payload: CheckoutPayload) {
    return this.paymentClient.send({ cmd: 'post.checkout' }, payload);
  }

  getReceiptUrl(sessionId: string) {
    return this.paymentClient.send({ cmd: 'get.receipt' }, sessionId);
  }

  getTransactionByOrderId(orderId: string) {
    return this.paymentClient.send({ cmd: 'payment.getTransactionByOrderId' }, orderId);
  }

  getTransactionBySessionId(sessionId: string) {
    return this.paymentClient.send({ cmd: 'payment.getTransactionBySessionId' }, sessionId);
  }
}
