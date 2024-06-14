import httpStatus from 'http-status';
import tokenService from './token.service';
import userService from './user.service';
import { Token, TokenDocument } from '../models/token.model';
import ApiError from '../utils/ApiError';
import { TokenTypes } from '../config/tokens';
import { UserDocument } from '../models/user.model';

const loginUserWithEmailAndPassword = async (
    email: string,
    password: string
): Promise<UserDocument> => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Incorrect email or password'
        );
    }
    return user;
};

const logout = async (refreshToken: string) => {
    const refreshTokenDoc = await Token.findOne({
        token: refreshToken,
        type: TokenTypes.REFRESH,
        blacklisted: false,
    });
    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.deleteOne();
};

const refreshAuth = async (refreshToken: string): Promise<object> => {
    try {
        const refreshTokenDoc: TokenDocument = await tokenService.verifyToken(
            refreshToken,
            TokenTypes.REFRESH
        );

        const user = await userService.getUserById(refreshTokenDoc.userId);
        if (user) {
            return await tokenService.generateAuthTokens(user);
        }
        throw new Error();
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};

const resetPassword = async (
    resetPasswordToken: string,
    newPassword: string
) => {
    try {
        const resetPasswordTokenDoc = await tokenService.verifyToken(
            resetPasswordToken,
            TokenTypes.RESET_PASSWORD
        );
        const user = await userService.getUserById(
            resetPasswordTokenDoc.userId
        );
        if (!user) {
            throw new Error();
        }
        await userService.updateUserById(user.id, { password: newPassword });
        await Token.deleteMany({
            user: user.id,
            type: TokenTypes.RESET_PASSWORD,
        });
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
};

const verifyEmail = async (verifyEmailToken: string) => {
    try {
        const verifyEmailTokenDoc = await tokenService.verifyToken(
            verifyEmailToken,
            TokenTypes.VERIFY_EMAIL
        );
        const user = await userService.getUserById(verifyEmailTokenDoc.userId);
        if (!user) {
            throw new Error();
        }
        await Token.deleteMany({
            user: user.id,
            type: TokenTypes.VERIFY_EMAIL,
        });
        await userService.updateUserById(user.id, { isEmailVerified: true });
    } catch (error) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Email verification failed'
        );
    }
};

export default {
    loginUserWithEmailAndPassword,
    logout,
    refreshAuth,
    resetPassword,
    verifyEmail,
};
