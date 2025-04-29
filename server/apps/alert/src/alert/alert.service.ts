import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';
import { AlertResponseDto, CreateAlertDto } from './dto/alert.dto';
import { AlertStatus, AlertType } from '@app/common/types/alert';
import { Resend } from 'resend';
import { AlertConfigService } from '../config/alert-config.service';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  private resend: Resend | null = null;

  constructor(
    @InjectModel(Alert.name) private alertModel: Model<AlertDocument>,
    private configService: AlertConfigService,
  ) {
    // Initialize Resend if API key is provided
    if (this.configService.resendApiKey) {
      this.resend = new Resend(this.configService.resendApiKey);
      this.logger.log('Resend API initialized successfully');
    } else {
      this.logger.warn('Resend API key not provided, email sending is mocked');
    }
  }

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

      // Check alert type
      if (!alertPayload.type || alertPayload.type.length === 0) {
        this.logger.warn(`Alert type is required`);
      }

      const alert = new this.alertModel(alertPayload);
      const savedAlert = await alert.save();

      if (data?.email) {
        this.logger.warn(`Alert type is email`);
        await this.sendEmail(savedAlert, data.email);
      }
      if (data?.mobile) {
        this.logger.warn(`Alert type is sms`);
        await this.sendSms(savedAlert, data.mobile);
      }

      // await this.sendEmail(savedAlert, data.email);
      // await this.sendSms(savedAlert, data.mobile);

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
            await this.sendEmail(alert, alert.email);
            break;
          case AlertType.SMS:
            await this.sendSms(alert, alert.mobile);
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

  private async sendEmail(alert: AlertDocument, email: string): Promise<void> {
    // Skip if no email address is provided
    if (!email) {
      this.logger.warn(`Cannot send email alert: no email address provided`);
      return;
    }

    this.logger.log(`Sending email alert to ${email}: ${alert.subject}`);

    // If Resend is not initialized, mock sending the email
    if (!this.resend) {
      this.logger.warn(`Mocking email send to ${email}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    try {
      const emailData = {
        from: this.configService.emailFrom,
        to: email,
        subject: alert.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">${alert.subject}</h1>
            <div style="margin: 20px 0;">
              ${alert.message}
            </div>
            <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
              This is an automated message from Eatzilla. Please do not reply to this email.
            </div>
          </div>
        `,
      };

      const { data, error } = await this.resend.emails.send(emailData);

      if (error) {
        throw new Error(`Failed to send email via Resend: ${error.message}`);
      }

      this.logger.log(`Email sent successfully via Resend. ID: ${data?.id}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to send email to ${alert.email}: ${err.message || 'Unknown error'}`,
        err.stack || 'No stack trace',
      );
    }
  }

  private async sendSms(alert: AlertDocument, mobile: string): Promise<void> {
    this.logger.log(`Sending SMS alert to ${mobile}: ${alert.subject}`);
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
