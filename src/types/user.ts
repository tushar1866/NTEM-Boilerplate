import { ObjectId } from 'mongoose';

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  isPasswordMatch: (password: string) => Promise<boolean>;
}

export interface JWTPayload extends Document {
  _id: any;
  email: string;
  role: string;
  type: string;
}
