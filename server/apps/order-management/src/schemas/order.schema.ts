import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  CREATED = 'created',
  PENDING_PAYMENT = 'pending_payment',
  PAYMENT_COMPLETED = 'payment_completed',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema()
export class OrderItem {
  @Prop({ required: true })
  @ApiProperty({ description: 'Menu item ID' })
  menuItemId: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'Item name' })
  name: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'Item price' })
  price: number;

  @Prop({ required: true, default: 1 })
  @ApiProperty({ description: 'Quantity ordered' })
  quantity: number;

  @Prop({ type: Object })
  @ApiProperty({ description: 'Any customizations to the item', required: false })
  customizations?: Record<string, any>;
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  @ApiProperty({ description: 'Customer ID (references User)' })
  customerId: Types.ObjectId;

  @Prop({ type: [{ type: Object }], required: true })
  @ApiProperty({ description: 'Array of order items', type: [OrderItem] })
  items: OrderItem[];

  @Prop({ required: true, default: 0 })
  @ApiProperty({ description: 'Subtotal amount before tax and fees' })
  subtotal: number;

  @Prop({ required: true, default: 0 })
  @ApiProperty({ description: 'Delivery fee' })
  deliveryFee: number;

  @Prop({ required: true, default: 0 })
  @ApiProperty({ description: 'Tax amount' })
  tax: number;

  @Prop({ required: true, default: 0 })
  @ApiProperty({ description: 'Total order amount' })
  total: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  @ApiProperty({
    description: 'Current order status',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  status: OrderStatus;

  @Prop({ type: Object })
  @ApiProperty({ description: 'Delivery address details' })
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    instructions?: string;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @ApiProperty({ description: 'ID of assigned delivery person', required: false })
  deliveryPersonId?: Types.ObjectId;

  @Prop()
  @ApiProperty({ description: 'Estimated delivery time', required: false })
  estimatedDeliveryTime?: Date;

  @Prop()
  @ApiProperty({ description: 'Actual delivery time', required: false })
  actualDeliveryTime?: Date;

  @Prop()
  @ApiProperty({ description: 'Payment ID from payment service', required: false })
  paymentId?: string;

  @Prop({ type: String })
  @ApiProperty({ description: 'Payment method used', required: false })
  paymentMethod?: string;

  @Prop({ default: false })
  @ApiProperty({ description: 'Whether payment has been completed', default: false })
  isPaid: boolean;

  @Prop({ default: [] })
  @ApiProperty({ description: 'History of status changes' })
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];

  @Prop()
  @ApiProperty({ description: 'Special instructions for the order', required: false })
  specialInstructions?: string;

  @Prop({ default: true })
  @ApiProperty({ description: 'Whether the order can be modified', default: true })
  isModifiable: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Add pre-save hook to update total and add status to history
OrderSchema.pre('save', function (next) {
  // Calculate total if items changed
  if (this.isModified('items') || this.isNew) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.total = this.subtotal + this.deliveryFee + this.tax;
  }

  // Add status to history if status changed
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });

    // Orders can only be modified before they're confirmed
    if (
      [
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.READY_FOR_PICKUP,
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
      ].includes(this.status)
    ) {
      this.isModifiable = false;
    }
  }

  next();
});
