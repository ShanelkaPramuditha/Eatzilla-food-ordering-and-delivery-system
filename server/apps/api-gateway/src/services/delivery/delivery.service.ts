import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DeliveryService {
  constructor(
    @Inject('DELIVERY_SERVICE')
    private readonly deliveryClient: ClientProxy,
  ) {}

  getStatus() {
    return this.deliveryClient.send({ cmd: 'get.status' }, {});
  }
}
