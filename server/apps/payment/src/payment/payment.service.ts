import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  getStatus(): string {
    return 'Payment service is running';
  }
}
