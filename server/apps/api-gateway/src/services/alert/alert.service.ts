import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAlertDto } from './dto/alert.dto';
import { Microservice } from '../../constants/microservice';
import { firstValueFrom } from 'rxjs';
import { Types } from 'mongoose';
import { AlertResponseDto } from 'apps/alert/src/alert/dto/alert.dto';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(
    @Inject(Microservice.ALERT_SERVICE)
    private readonly alertClient: ClientProxy,
  ) {}

  // Get the status of the alert service
  getStatus() {
    return this.alertClient.send({ cmd: 'get.status' }, {});
  }

  // Create a new alert
  async createAlert(userId: string, data: CreateAlertDto): Promise<AlertResponseDto> {
    try {
      this.logger.log(`Creating alert of types: ${data.types.join(', ')} for user: ${userId}`);

      // Transform gateway DTO to microservice DTO format
      const alertPayload = {
        userId: new Types.ObjectId(userId),
        type: data.types,
        level: data.level,
        recipient: data.recipient,
        subject: data.subject,
        message: data.message,
      };

      return await firstValueFrom(this.alertClient.send({ cmd: 'create.alert' }, alertPayload));
    } catch (error) {
      this.logger.error(
        `Error creating alert: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  getUserAlerts(userId: string) {
    return firstValueFrom(this.alertClient.send({ cmd: 'get.user.alerts' }, userId));
  }

  getAllAlerts() {
    return firstValueFrom(this.alertClient.send({ cmd: 'get.all.alerts' }, {}));
  }
}
