import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roleRights } from '../config/roles';
import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

const verifyCallback =
    (req: Request, requiredRights: string[]): passport.AuthenticateCallback =>
    async (err: Error, user: any, info) => {
        if (err || info || !user) {
            if (info instanceof TokenExpiredError) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Token expired');
            }
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
        }
        req.user = user;

        if (requiredRights.length) {
            const userRights = roleRights.get(user.role);
            const hasRequiredRights = requiredRights.every(
                (requiredRight: string) => userRights?.includes(requiredRight)
            );
            if (!hasRequiredRights && req.params.userId !== user._id) {
                throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
            }
        }
        return true;
    };

const auth =
    (...requiredRights: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        return await passport.authenticate(
            'jwt',
            { session: false },
            async (err: Error, user: any, info: any) => {
                try {
                    await verifyCallback(req, requiredRights)(err, user, info);
                    next();
                } catch (error) {
                    next(error);
                }
            }
        )(req, res, next);
    };

export default auth;
