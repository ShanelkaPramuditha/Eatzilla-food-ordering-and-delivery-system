import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, type Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  CREATED = 'created',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema()
export class OrderItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  @ApiProperty({ description: 'Menu item ID' })
  menuItemId: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty({ description: 'Item name at time of ordering' })
  name: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'Price at order time' })
  price: number;

  @Prop({ required: true, default: 1, min: 1 })
  @ApiProperty({ description: 'Quantity ordered' })
  quantity: number;

  @Prop({ type: Object })
  @ApiProperty({ description: 'Item customizations' })
  customizations?: Record<string, any>;
}

@Schema()
export class Suborder {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Restaurant' })
  @ApiProperty({ description: 'Restaurant ID' })
  restaurantId: Types.ObjectId;

  @Prop({ type: [{ type: Object, ref: OrderItem }], required: true })
  @ApiProperty({ description: 'Items from this restaurant' })
  items: OrderItem[];

  @Prop({ required: true, default: 0 })
  @ApiProperty({ description: 'Subtotal for these items' })
  subtotal: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  @ApiProperty({ enum: OrderStatus, description: 'Suborder status' })
  status: OrderStatus;
}

@Schema()
export class Address {
  @Prop({ required: true })
  @ApiProperty({ description: 'Street address' })
  street: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'City' })
  city: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'State or province' })
  state: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'Postal code' })
  postalCode: string;

  @Prop()
  @ApiProperty({ description: 'Delivery instructions', required: false })
  instructions?: string;
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  @ApiProperty({ description: 'Customer ID' })
  customerId: Types.ObjectId;

  @Prop({ type: [{ type: Object, ref: Suborder }], required: true })
  @ApiProperty({ description: 'Suborders grouped by restaurant', type: [Suborder] })
  suborders: Suborder[];

  @Prop({ required: true, default: 0 })
  @ApiProperty({ description: 'Subtotal amount' })
  subtotal: number;

  @Prop({ required: true, default: 0 })
  @ApiProperty({ description: 'Delivery fee' })
  deliveryFee: number;

  @Prop({ required: true, default: 0 })
  @ApiProperty({ description: 'Tax amount' })
  tax: number;

  @Prop({ required: true, default: 0 })
  @ApiProperty({ description: 'Total amount' })
  total: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  @ApiProperty({ enum: OrderStatus, description: 'Order status' })
  status: OrderStatus;

  @Prop({ type: Object, required: true })
  @ApiProperty({ description: 'Delivery address', type: Address })
  deliveryAddress: Address;

  @Prop()
  @ApiProperty({ description: 'Estimated delivery time', required: false })
  estimatedDeliveryTime?: Date;

  @Prop()
  @ApiProperty({ description: 'Actual delivery time', required: false })
  actualDeliveryTime?: Date;

  @Prop()
  @ApiProperty({ description: 'Payment ID', required: false })
  paymentId?: string;

  @Prop()
  @ApiProperty({ description: 'Payment method', required: false })
  paymentMethod?: string;

  @Prop({ default: false })
  @ApiProperty({ description: 'Payment status' })
  isPaid: boolean;

  @Prop()
  @ApiProperty({ description: 'Special instructions', required: false })
  specialInstructions?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre('save', function (next) {
  if (this.isModified('suborders') || this.isNew) {
    // Calculate suborder totals
    this.suborders.forEach((suborder) => {
      suborder.subtotal = suborder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });

    // Calculate order totals
    this.subtotal = this.suborders.reduce((sum, suborder) => sum + suborder.subtotal, 0);
    this.total = this.subtotal + this.deliveryFee + this.tax;
  }

  next();
});
