import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AlertLevel, AlertStatus, AlertType } from '@app/common/types/alert';

@Schema({ timestamps: true })
export class Alert extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
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
    enum: Object.values(AlertLevel),
  })
  level: AlertLevel;

  @Prop({ required: true })
  recipient: string;

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
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

export interface AlertDocument extends Alert {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
}
