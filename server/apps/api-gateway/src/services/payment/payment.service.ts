import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Microservice } from '../../constants/microservice';

export type CheckoutPayload = {
  paymentType: 'card' | 'cashapp';
  currencyType: string;
  unit_amount: number;
  quantity: number;
  orderId: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  productId: string;
  productName: string;
  productDescription?: string;
  productImages?: string[];
};

@Injectable()
export class PaymentService {
  constructor(
    @Inject(Microservice.PAYMENT)
    private readonly paymentClient: ClientProxy,
  ) {}

  getStatus() {
    return this.paymentClient.send({ cmd: 'get.status' }, {});
  }

  getProducts() {
    return this.paymentClient.send({ cmd: 'get.products' }, {});
  }

  checkout(payload: CheckoutPayload[]) {
    return this.paymentClient.send({ cmd: 'post.checkout' }, payload);
  }
}
