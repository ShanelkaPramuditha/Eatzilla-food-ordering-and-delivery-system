import { Controller } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @MessagePattern({ cmd: 'get.status' })
  getStatus(): string {
    return this.deliveryService.getStatus();
  }
}
