import { Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  RESTAURANT_OWNER = 'restaurant_owner',
  DELIVERY_PERSON = 'delivery_person',
  CUSTOMER = 'customer',
  GUEST = 'guest',
}

export interface User {
  _id: Types.ObjectId;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  active: boolean;
}
