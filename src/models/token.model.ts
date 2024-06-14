import mongoose, { Document, Model, ObjectId, Schema } from 'mongoose';
// import { toJSON } from './plugins';
import { TokenTypes } from '../config/tokens';

type TokenDocument = Document & {
    token: string;
    userId: ObjectId;
    type: string;
    expires: Date;
    blacklisted: boolean;
};
const TokenSchema: Schema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: TokenTypes,
            required: true,
        },
        expires: {
            type: Date,
            required: true,
        },
        blacklisted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
// tokenSchema.plugin(toJSON);

const Token: Model<TokenDocument> = mongoose.model<TokenDocument>(
    'Token',
    TokenSchema
);

export { Token, TokenDocument };
