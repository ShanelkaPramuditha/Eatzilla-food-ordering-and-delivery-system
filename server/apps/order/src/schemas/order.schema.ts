import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
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

// --------------------- OrderItem ---------------------
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

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// --------------------- Suborder ---------------------
@Schema({ _id: true }) // Explicitly enable _id generation
export class Suborder {
  @ApiProperty({ description: 'Suborder ID' })
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Restaurant' })
  @ApiProperty({ description: 'Restaurant ID' })
  restaurantId: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  @ApiProperty({ description: 'Items from this restaurant', type: [OrderItem] })
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

export const SuborderSchema = SchemaFactory.createForClass(Suborder);

// --------------------- Address ---------------------
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

export const AddressSchema = SchemaFactory.createForClass(Address);

// --------------------- Order ---------------------
export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  @ApiProperty({ description: 'Customer ID' })
  customerId: Types.ObjectId;

  @Prop({ type: [SuborderSchema], required: true })
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

  @Prop({ type: AddressSchema, required: true })
  @ApiProperty({ description: 'Delivery address', type: Address })
  deliveryAddress: Address;

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
  @ApiProperty({ description: 'Special Instructions' })
  specialInstructions?: string;

  @ApiProperty({ description: 'MongoDB ObjectId' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Pre-save hook to calculate totals
OrderSchema.pre('save', function (next) {
  if (this.isModified('suborders') || this.isNew) {
    this.suborders.forEach((suborder) => {
      suborder.subtotal = suborder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });

    this.subtotal = this.suborders.reduce((sum, suborder) => sum + suborder.subtotal, 0);
    this.deliveryFee = 5.99;
    this.tax = this.subtotal * 0.1;
    this.total = this.subtotal + this.deliveryFee + this.tax;
  }

  next();
});
