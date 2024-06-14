import { Request } from 'express';
import { UserDocument } from '../models/user.model';

export interface CustomReq extends Request {
    user: UserDocument;
}
