import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAlertDto } from './dto/alert.dto';
import { Microservice } from '../../constants/microservice';
import { firstValueFrom } from 'rxjs';
import { Types } from 'mongoose';
import { AlertResponseDto } from 'apps/alert/src/alert/dto/alert.dto';
import { NotificationGateway } from '../../websocket/websocket.gateway';
import { catchRpcError } from '../../filters/rpc-exception.filter';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @Inject(Microservice.ALERT_SERVICE)
    private readonly alertClient: ClientProxy,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  // Get the status of the alert service
  getStatus() {
    return this.alertClient
      .send({ cmd: 'get.status' }, {})
      .pipe(catchRpcError('Failed to get alert service status'));
  }

  // Create a new alert
  createAlert(userId: string, email: string, mobile: string, data: CreateAlertDto) {
    try {
      // Transform gateway DTO to microservice DTO format
      const alertPayload = {
        userId: new Types.ObjectId(userId),
        type: data.types,
        level: data.level,
        category: data.category,
        data: data.data,
        email: email,
        mobile: mobile,
        subject: data.subject,
        message: data.message,
        isRead: false,
      };

      // this.notificationGateway.sendAlertToAll('TEST');
      const alertResponse = this.alertClient
        .send({ cmd: 'create.alert' }, alertPayload)
        .pipe(catchRpcError('Failed to create alert'));

      alertResponse.subscribe({
        next: (response: AlertResponseDto) => {
          if (response && response.id) {
            this.notificationGateway.sendAlertToUser(userId, {
              type: 'alert',
              response,
            });
          }
        },
        error: (error) => {
          this.logger.error('Error creating alert:', error);
        },
      });

      return alertResponse;
    } catch (error) {
      this.logger.error(
        `Error creating alert: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  createHTTPAlert(userId: string, email: string, mobile: string, data: CreateAlertDto) {
    try {
      // Transform gateway DTO to microservice DTO format
      const alertPayload = {
        userId: new Types.ObjectId(userId),
        type: data.types,
        level: data.level,
        category: data.category,
        data: data.data,
        email: email,
        mobile: mobile,
        subject: data.subject,
        message: data.message,
        isRead: false,
      };

      // this.notificationGateway.sendAlertToAll('TEST');
      const alertResponse = this.alertClient
        .send({ cmd: 'create.alert' }, alertPayload)
        .pipe(catchRpcError('Failed to create alert'));

      alertResponse.subscribe({
        next: (response: AlertResponseDto) => {
          if (response && response.id) {
            this.notificationGateway.sendAlertToUser(userId, {
              type: 'alert',
              response,
            });
          }
        },
        error: (error) => {
          this.logger.error('Error creating alert:', error);
        },
      });

      return alertResponse;
    } catch (error) {
      this.logger.error(
        `Error creating alert: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  getUserAlerts(userId: string) {
    try {
      return this.alertClient
        .send({ cmd: 'get.user.alerts' }, userId)
        .pipe(catchRpcError('Failed to get user alerts'));
    } catch (error) {
      this.logger.error(
        `Error getting user alerts: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  getAllAlerts() {
    return firstValueFrom(this.alertClient.send({ cmd: 'get.all.alerts' }, {}));
  }

  markAlertAsRead(userId: string, alertId: string) {
    try {
      return this.alertClient
        .send({ cmd: 'mark.alert.read' }, { userId, alertId })
        .pipe(catchRpcError('Failed to mark alert as read'));
    } catch (error) {
      this.logger.error(
        `Error marking alert as read: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
