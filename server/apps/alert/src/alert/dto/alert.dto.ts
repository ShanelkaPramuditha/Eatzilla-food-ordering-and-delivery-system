import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsMongoId,
  IsObject,
} from 'class-validator';
import { AlertCategory, AlertLevel, AlertStatus, AlertType } from '@app/common/types/alert';
import { Types } from 'mongoose';

export class CreateAlertDto {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(AlertType, { each: true })
  type: AlertType[];

  @IsString()
  @IsEnum(AlertCategory)
  category: AlertCategory = AlertCategory.DEFAULT;

  @IsObject()
  data: object;

  @IsEnum(AlertLevel)
  level: AlertLevel;

  @IsString()
  email?: string;

  @IsString()
  mobile?: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class AlertResponseDto {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  type: AlertType[];
  level: AlertLevel;
  category: AlertCategory;
  data: object;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  status: AlertStatus;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}
