import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  getStatus(): string {
    return 'Order service is running';
  }
}
