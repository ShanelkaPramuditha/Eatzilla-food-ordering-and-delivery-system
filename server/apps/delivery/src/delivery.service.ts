import { Injectable } from '@nestjs/common';

@Injectable()
export class DeliveryService {
  getStatus(): string {
    return 'Hello World!';
  }
}
