import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Location schema for storing GPS coordinates
@Schema({ _id: false })
export class Location {
  @Prop({ required: true, type: Number })
  lat: number;

  @Prop({ required: true, type: Number })
  lng: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

// Delivery person availability schema
@Schema({ timestamps: true })
export class DeliveryPersonAvailability extends Document {
  @Prop({ required: true, index: true })
  deliveryPersonId: string;

  @Prop({ required: true, default: false })
  isAvailable: boolean;

  @Prop({ type: LocationSchema })
  currentLocation: Location;

  @Prop({ default: Date.now })
  lastUpdated: Date;

  @Prop({ default: false })
  isOnDelivery: boolean;

  @Prop({ default: null })
  currentOrderId: string;

  @Prop({ default: 'offline' })
  status: string; // 'online', 'offline', 'busy'
}

export const DeliveryPersonAvailabilitySchema = SchemaFactory.createForClass(
  DeliveryPersonAvailability,
);

// Create indexes for querying
DeliveryPersonAvailabilitySchema.index({ deliveryPersonId: 1 }, { unique: true });
DeliveryPersonAvailabilitySchema.index({ isAvailable: 1 });
DeliveryPersonAvailabilitySchema.index({ status: 1 });

// Create a 2dsphere index for geospatial queries
// Note: This requires MongoDB 2.4+
DeliveryPersonAvailabilitySchema.index({ currentLocation: '2dsphere' });
