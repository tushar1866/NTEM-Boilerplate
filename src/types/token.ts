import { Document, ObjectId } from 'mongoose';

export interface IToken extends Document {
    token: string;
    user: ObjectId;
    type: string;
    expires: Date;
    blacklisted: boolean;
}
