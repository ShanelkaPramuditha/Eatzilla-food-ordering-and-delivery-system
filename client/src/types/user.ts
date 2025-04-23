import { USER } from '@/constants';

export interface User {
  _id?: string;
  email: string;
  name: string;
  picture?: string;
  role: USER.UserRole;
}
