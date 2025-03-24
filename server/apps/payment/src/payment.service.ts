import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  getPayment(): string {
    return 'Payment service is running';
  }
}
