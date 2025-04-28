import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @ApiProperty({ description: 'Order ID associated with this transaction' })
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Order' })
  orderId: Types.ObjectId;

  @ApiProperty({ description: 'Customer ID who made the payment' })
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  customerId: Types.ObjectId;

  @ApiProperty({ description: 'Stripe payment intent ID' })
  @Prop({ required: true })
  paymentIntentId: string;

  @ApiProperty({ description: 'Stripe charge ID' })
  @Prop({ required: true })
  chargeId: string;

  @ApiProperty({ description: 'Stripe session ID' })
  @Prop({ required: true })
  sessionId: string;

  @ApiProperty({ description: 'Transaction amount in cents' })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ description: 'Currency code' })
  @Prop({ required: true, default: 'LKR' })
  currency: string;

  @ApiProperty({ description: 'Payment status from Stripe' })
  @Prop({ required: true })
  paymentStatus: string;

  @ApiProperty({ description: 'Payment method used' })
  @Prop({ required: true, default: 'card' })
  paymentMethod: string;

  @ApiProperty({ description: 'Receipt URL from Stripe' })
  @Prop()
  receiptUrl: string;

  @ApiProperty({ description: 'Additional metadata about the transaction' })
  @Prop({ type: Object })
  metadata: Record<string, any>;

  @ApiProperty({ description: 'MongoDB ObjectId' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
