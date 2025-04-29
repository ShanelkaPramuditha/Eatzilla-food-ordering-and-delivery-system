import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';
import { AlertResponseDto, CreateAlertDto } from './dto/alert.dto';
import { AlertStatus, AlertType } from '@app/common/types/alert';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(@InjectModel(Alert.name) private alertModel: Model<AlertDocument>) {}

  getStatus(): string {
    return 'Alert service is running';
  }

  async createNotificationAlert(data: CreateAlertDto): Promise<AlertResponseDto> {
    try {
      const alertPayload = {
        userId: new Types.ObjectId(data.userId),
        type: data.type,
        level: data.level,
        category: data.category,
        data: data.data,
        subject: data.subject,
        message: data.message,
        isRead: false,
      };

      // Check if alert already exists
      const existingAlert = await this.alertModel.findOne({
        userId: alertPayload.userId,
        type: alertPayload.type,
        level: alertPayload.level,
        category: alertPayload.category,
        data: alertPayload.data,
        subject: alertPayload.subject,
        message: alertPayload.message,
      });

      if (existingAlert) {
        this.logger.warn(`Alert already exists`);
        return this.mapToResponseDto(existingAlert);
      }

      const alert = new this.alertModel(alertPayload);
      const savedAlert = await alert.save();

      // Process different alert types
      await this.processAlertByTypes(savedAlert);

      return this.mapToResponseDto(savedAlert);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to create notification alert: ${err.message || 'Unknown error'}`,
        err.stack || 'No stack trace',
      );
      throw error;
    }
  }

  async createAlert(data: CreateAlertDto): Promise<AlertResponseDto> {
    try {
      const alert = new this.alertModel(data);
      const savedAlert = await alert.save();

      // Process different alert types
      await this.processAlertByTypes(savedAlert);

      return this.mapToResponseDto(savedAlert);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to create alert: ${err.message || 'Unknown error'}`,
        err.stack || 'No stack trace',
      );
      throw error;
    }
  }

  async getUserAlerts(userId: string): Promise<AlertResponseDto[]> {
    const alerts = await this.alertModel.find({ userId }).sort({ createdAt: -1 }).exec();
    return alerts.map((alert) => this.mapToResponseDto(alert));
  }

  async getAllAlerts(): Promise<AlertResponseDto[]> {
    // Get only types: notification
    // const alerts = await this.alertModel.find().sort({ createdAt: -1 }).exec();
    const notifications = await this.alertModel
      .find({ type: AlertType.NOTIFICATION })
      .sort({ createdAt: -1 })
      .exec();
    const alerts = notifications.filter((alert) => alert.type.includes(AlertType.NOTIFICATION));
    return alerts.map((alert) => this.mapToResponseDto(alert));
  }

  private async processAlertByTypes(alert: AlertDocument): Promise<void> {
    try {
      this.logger.log(`Processing alert of type: ${alert.type.join(', ')}`);

      for (const type of alert.type) {
        switch (type) {
          case AlertType.EMAIL:
            await this.sendEmail(alert);
            break;
          case AlertType.SMS:
            await this.sendSms(alert);
            break;
          case AlertType.NOTIFICATION:
          default:
            this.logger.warn(`Unsupported alert type: ${String(type)}`);
        }
      }

      // Update alert status to SENT after successful processing
      await this.alertModel.updateOne({ _id: alert._id }, { $set: { status: AlertStatus.SENT } });
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to process alert ${String(alert.id)}: ${err.message || 'Unknown error'}`,
        err.stack || 'No stack trace',
      );

      // Update alert status to FAILED if processing fails
      await this.alertModel.updateOne({ _id: alert.id }, { $set: { status: AlertStatus.FAILED } });

      throw error;
    }
  }

  private async sendEmail(alert: AlertDocument): Promise<void> {
    this.logger.log(`Sending email alert to ${alert.email}: ${alert.subject}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  private async sendSms(alert: AlertDocument): Promise<void> {
    this.logger.log(`Sending SMS alert to ${alert.mobile}: ${alert.subject}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  private mapToResponseDto(alert: AlertDocument): AlertResponseDto {
    return {
      id: alert._id instanceof Types.ObjectId ? alert._id : new Types.ObjectId(String(alert._id)),
      userId: alert.userId,
      type: alert.type,
      level: alert.level,
      category: alert.category,
      data: alert.data,
      email: alert.email,
      mobile: alert.mobile,
      subject: alert.subject,
      message: alert.message,
      status: alert.status,
      isRead: alert.isRead,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
    };
  }

  async markAlertAsRead(userId: string, alertId: string): Promise<AlertResponseDto> {
    try {
      const alert = await this.alertModel.findOneAndUpdate(
        { _id: new Types.ObjectId(alertId), userId: new Types.ObjectId(userId) },
        { $set: { isRead: true } },
        { new: true },
      );

      if (!alert) {
        throw new Error(`Alert not found or not authorized`);
      }

      return this.mapToResponseDto(alert);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to mark alert as read: ${err.message || 'Unknown error'}`,
        err.stack || 'No stack trace',
      );
      throw error;
    }
  }
}
