import { Document, ObjectId } from 'mongoose';

export interface JWTPayload extends Document {
    sub: any;
    email: string;
    role: string;
    type: string;
}
