import { IsEnum, IsNotEmpty, IsString, IsArray, ArrayNotEmpty, IsMongoId } from 'class-validator';
import { AlertLevel, AlertStatus, AlertType } from '@app/common/types/alert';
import { Types } from 'mongoose';

export class CreateAlertDto {
  @IsMongoId()
  userId: Types.ObjectId;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(AlertType, { each: true })
  type: AlertType[];

  @IsEnum(AlertLevel)
  level: AlertLevel;

  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class AlertResponseDto {
  id: string;
  userId: Types.ObjectId;
  type: AlertType[];
  level: AlertLevel;
  recipient: string;
  subject: string;
  message: string;
  status: AlertStatus;
  createdAt: Date;
  updatedAt: Date;
}
