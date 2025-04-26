import { firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { AlertService } from './services/alert/alert.service';
import { PaymentService } from './services/payment/payment.service';
import { OrderService } from './services/order/order.service';
import { DeliveryService } from './services/delivery/delivery.service';

@Injectable()
export class ApiGatewayService {
  private readonly logger = new Logger(ApiGatewayService.name);

  constructor(
    private readonly alertService: AlertService,
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
    private readonly deliveryService: DeliveryService,
  ) {}

  async checkStatus(): Promise<{
    status: string;
    message: string;
    timestamp: string;
    uptime: number;
    services: {
      payment: string;
      order: string;
      alert: string;
    };
  }> {
    this.logger.log('Checking services status');

    // Handle each service individually to prevent one failure from affecting others
    const getServiceStatus = async (
      service: string,
      statusCall: Promise<unknown>,
    ): Promise<string> => {
      try {
        const status = await statusCall;

        // Proper handling of different status response types
        if (status === null || status === undefined) {
          return 'unavailable';
        }

        // String - return directly
        if (typeof status === 'string') {
          return status;
        }

        // Object - convert to JSON string
        if (typeof status === 'object') {
          // Try to extract status from object without default stringification
          if (status && typeof (status as Record<string, unknown>).status !== 'undefined') {
            const objectStatus = (status as Record<string, unknown>).status;
            return typeof objectStatus === 'string' ? objectStatus : JSON.stringify(objectStatus);
          }

          // Convert the entire object to JSON string instead of using default toString()
          return JSON.stringify(status);
        }

        // Number - convert safely
        if (typeof status === 'number') {
          return status.toString();
        }

        // Boolean - convert safely
        if (typeof status === 'boolean') {
          return status ? 'true' : 'false';
        }

        // Any other type - convert to string representation
        return 'unknown';
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.warn(`Failed to get status for ${service} service: ${errorMessage}`);
        return 'unavailable';
      }
    };

    // Get the status of each service independently
    const alertStatus = await getServiceStatus(
      'alert',
      firstValueFrom(this.alertService.getStatus()),
    );
    const paymentStatus = await getServiceStatus(
      'payment',
      firstValueFrom(this.paymentService.getStatus()),
    );
    const orderStatus = await getServiceStatus(
      'order',
      firstValueFrom(this.orderService.getStatus()),
    );

    const deliveryStatus = await getServiceStatus(
      'delivery',
      firstValueFrom(this.deliveryService.getStatus()),
    );

    // Determine overall system status
    const allServicesWorking =
      alertStatus !== 'unavailable' &&
      paymentStatus !== 'unavailable' &&
      orderStatus !== 'unavailable' &&
      deliveryStatus !== 'unavailable';

    const anyServiceWorking =
      alertStatus !== 'unavailable' ||
      paymentStatus !== 'unavailable' ||
      orderStatus !== 'unavailable' ||
      deliveryStatus !== 'unavailable';

    let systemStatus = 'error';
    let statusMessage = 'All services are unavailable';

    if (allServicesWorking) {
      systemStatus = 'ok';
      statusMessage = 'All services are operational';
    } else if (anyServiceWorking) {
      systemStatus = 'degraded';
      statusMessage = 'Some services are experiencing issues';
    }

    const response = {
      status: systemStatus,
      message: statusMessage,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        alert: alertStatus,
        payment: paymentStatus,
        order: orderStatus,
        delivery: deliveryStatus,
      },
    };

    this.logger.log(`Service status check complete: ${response.status}`);
    return response;
  }
}
