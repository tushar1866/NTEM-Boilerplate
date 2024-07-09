import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import httpStatus from 'http-status';
import config from '../config/config';
import userService from './user.service';
import { Token } from '../models';
import ApiError from '../utils/ApiError';
import { TokenTypes } from '../config/tokens';
import mongoose from 'mongoose';
import { TokenDocument } from '../models/token.model';
import { UserDocument } from '../models/user.model';

const generateToken = (
    userId: mongoose.Types.ObjectId,
    expires: Moment,
    type: string,
    secret: string = config.jwt.secret
): string => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};

const saveToken = async (
    token: string,
    userId: mongoose.Types.ObjectId,
    expires: Moment,
    type: string,
    blacklisted: boolean = false
): Promise<TokenDocument> => {
    const tokenDoc = await Token.create({
        token,
        userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};

const verifyToken = async (
    token: string,
    type: string
): Promise<TokenDocument> => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc: TokenDocument | null = await Token.findOne({
        token,
        type,
        userId: payload.sub,
        blacklisted: false,
    });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
};

const generateAuthTokens = async (user: UserDocument): Promise<object> => {
    const accessTokenExpires = moment().add(
        config.jwt.accessExpirationMinutes,
        'minutes'
    );
    const accessToken = generateToken(
        user._id,
        accessTokenExpires,
        TokenTypes.ACCESS
    );

    const refreshTokenExpires = moment().add(
        config.jwt.refreshExpirationDays,
        'days'
    );
    const refreshToken = generateToken(
        user._id,
        refreshTokenExpires,
        TokenTypes.REFRESH
    );
    await saveToken(
        refreshToken,
        user._id,
        refreshTokenExpires,
        TokenTypes.REFRESH
    );

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};

const generateResetPasswordToken = async (email: string): Promise<string> => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'No users found with this email'
        );
    }
    const expires = moment().add(
        config.jwt.resetPasswordExpirationMinutes,
        'minutes'
    );
    const resetPasswordToken = generateToken(
        user.id,
        expires,
        TokenTypes.RESET_PASSWORD
    );
    await saveToken(
        resetPasswordToken,
        user.id,
        expires,
        TokenTypes.RESET_PASSWORD
    );
    return resetPasswordToken;
};

const generateVerifyEmailToken = async (
    user: UserDocument
): Promise<string> => {
    const expires = moment().add(
        config.jwt.verifyEmailExpirationMinutes,
        'minutes'
    );
    const verifyEmailToken = generateToken(
        user._id,
        expires,
        TokenTypes.VERIFY_EMAIL
    );
    await saveToken(
        verifyEmailToken,
        user._id,
        expires,
        TokenTypes.VERIFY_EMAIL
    );
    return verifyEmailToken;
};

export default {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
};
