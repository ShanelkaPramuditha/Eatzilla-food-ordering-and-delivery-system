import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// Types
import { Address, RestaurantStatus } from '../../types/restaurant';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({
    required: true,
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
  })
  location: Address;

  @Prop({ required: true })
  image: string;

  @Prop({ default: 'pending', index: true, enum: RestaurantStatus })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  owner: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
