import { Injectable } from '@nestjs/common';

@Injectable()
export class DeliveryService {
  getStatus(): string {
    return 'Delivery service is running';
  }
}
