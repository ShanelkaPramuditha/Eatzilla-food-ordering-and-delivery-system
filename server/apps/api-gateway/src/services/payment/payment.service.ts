import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentClient: ClientProxy,
  ) {}

  getPayment() {
    return this.paymentClient.send({ cmd: 'get.payment' }, {});
  }
}
