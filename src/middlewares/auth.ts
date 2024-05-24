import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roleRights } from '../config/roles';
import { NextFunction, Request, Response } from 'express';

const verifyCallback =
    (req: Request, requiredRights: string[]): passport.AuthenticateCallback =>
    async (err: Error, user: any, info) => {
        console.log('FIRST LINE', err, info, user);
        if (err || info || !user) {
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
        try {
            const result = await passport.authenticate(
                'jwt',
                { session: false },
                verifyCallback(req, requiredRights)
            )(req, res, next);
            console.log('RESULT', result);
            if (!result) {
                throw result;
            }
            next(result);
        } catch (err) {
            console.log('AUTH ERR', err);
            throw next(err);
        }
    };

export default auth;
