import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';
import { AlertResponseDto, CreateAlertDto } from './dto/alert.dto';
import { AlertStatus, AlertType } from '@app/common/types/alert';
import { Resend } from 'resend';
import { AlertConfigService } from '../config/alert-config.service';
import { Twilio } from 'twilio';
import type { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  private resend: Resend | null = null;
  private twilioClient: Twilio | null = null;

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

    // Initialize Twilio if credentials are provided
    if (this.configService.twilioAccountSid && this.configService.twilioAuthToken) {
      this.twilioClient = new Twilio(
        this.configService.twilioAccountSid,
        this.configService.twilioAuthToken,
      );
      this.logger.log('Twilio client initialized successfully');
    } else {
      this.logger.warn('Twilio credentials not provided, SMS sending is mocked');
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
        // await this.sendSms(savedAlert, data.mobile);
      }

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
    // Skip if no mobile number is provided
    if (!mobile) {
      this.logger.warn(`Cannot send SMS alert: no mobile number provided`);
      return;
    }

    this.logger.log(`Sending SMS alert to ${mobile}: ${alert.subject}`);

    // If Twilio is not initialized, mock sending the SMS
    if (!this.twilioClient) {
      this.logger.warn(`Mocking SMS send to ${mobile}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      return;
    }

    try {
      // Create properly typed message params
      const messageParams: MessageListInstanceCreateOptions = {
        body: `${alert.subject}\n\n${alert.message}`,
        to: mobile,
      };

      // Add optional parameters if they exist
      if (this.configService.twilioMessagingServiceSid) {
        messageParams.messagingServiceSid = this.configService.twilioMessagingServiceSid;
      }

      if (this.configService.twilioPhoneNumber) {
        messageParams.from = this.configService.twilioPhoneNumber;
      }

      // Validate configuration
      if (!messageParams.messagingServiceSid && !messageParams.from) {
        throw new Error(
          'Either Twilio Messaging Service SID or From phone number must be provided',
        );
      }

      const message = await this.twilioClient.messages.create(messageParams);

      this.logger.log(`SMS sent successfully via Twilio. SID: ${message.sid}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to send SMS to ${mobile}: ${err.message || 'Unknown error'}`,
        err.stack || 'No stack trace',
      );
      throw error;
    }
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
