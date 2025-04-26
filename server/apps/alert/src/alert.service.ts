import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertService {
  getStatus(): string {
    return 'Alert service is running';
  }
}
