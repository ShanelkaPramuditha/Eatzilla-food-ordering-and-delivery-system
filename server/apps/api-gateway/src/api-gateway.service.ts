import { Injectable } from '@nestjs/common';
import { PaymentService } from './services/payment/payment.service';
import { OrderService } from './services/order/order.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiGatewayService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  async checkStatus(): Promise<{
    status: string;
    message: string;
    timestamp: string;
    uptime: number;
    services: {
      payment: string;
      order: string;
    };
  }> {
    try {
      const [paymentStatus, orderStatus] = await Promise.all([
        firstValueFrom(this.paymentService.getStatus()),
        firstValueFrom(this.orderService.getStatus()),
      ]);

      const allServicesWorking = paymentStatus && orderStatus;

      return {
        status: allServicesWorking ? 'ok' : 'degraded',
        message: allServicesWorking
          ? 'All services are operational'
          : 'Some services are experiencing issues',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          payment: paymentStatus || 'unavailable',
          order: orderStatus || 'unavailable',
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error checking service status',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          payment: 'unknown',
          order: 'unknown',
        },
      };
    }
  }
}
