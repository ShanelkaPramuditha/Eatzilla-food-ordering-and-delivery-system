import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { AlertCategory, AlertLevel, AlertStatus, AlertType } from '@app/common/types/alert';

@Schema({ timestamps: true })
export class Alert extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    type: [String],
    enum: Object.values(AlertType),
  })
  type: AlertType[];

  @Prop({
    required: true,
    type: String,
    enum: Object.values(AlertCategory),
  })
  category: AlertCategory;

  @Prop({ required: false, type: Object })
  data: object;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(AlertLevel),
  })
  level: AlertLevel;

  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  mobile: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    default: AlertStatus.PENDING,
    type: String,
    enum: Object.values(AlertStatus),
  })
  status: AlertStatus;

  @Prop({ default: false })
  isRead: boolean;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

export interface AlertDocument extends Alert {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
}
