import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

interface CheckoutPayload {
  priceId?: string;
  quantity?: number;
}

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientProxy,
  ) {}

  getStatus() {
    return this.paymentClient.send({ cmd: 'get.status' }, {});
  }

  getProducts() {
    return this.paymentClient.send({ cmd: 'get.products' }, {});
  }

  checkout(payload: CheckoutPayload) {
    return this.paymentClient.send({ cmd: 'post.checkout' }, {});
  }
}
