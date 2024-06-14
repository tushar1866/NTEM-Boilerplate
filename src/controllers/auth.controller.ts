import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { CustomReq } from '../types/common';
import { userService, tokenService, authService } from '../services';

const register = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser({ ...req.body, role: 'admin' });
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(
        email,
        password
    );
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(
        req.body.email
    );
    // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(httpStatus.OK).send({
        body: req.body.email,
        resetPasswordToken,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    await authService.resetPassword(
        req.query.token as string,
        req.body.password
    );
    res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(
    async (req: Request, res: Response) => {
        const verifyEmailToken = await tokenService.generateVerifyEmailToken(
            (req as CustomReq).user
        );
        // await emailService.sendVerificationEmail((req as CustomReq).user.email, verifyEmailToken);
        res.status(httpStatus.OK).send({
            email: (req as CustomReq).user.email,
            verifyEmailToken,
        });
    }
);

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    await authService.verifyEmail(req.body.token as string);
    res.status(httpStatus.NO_CONTENT).send();
});

export default {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
};
