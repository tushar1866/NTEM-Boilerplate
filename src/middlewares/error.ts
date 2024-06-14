import mongoose from 'mongoose';
import httpStatus from 'http-status';
import config from '../config/config';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';
import { NextFunction, Request, Response } from 'express';

const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        let { statusCode, message } = err;
        if (config.env === 'production' && !err.isOperational) {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
        }

        res.locals.errorMessage = err.message;

        const response = {
            code: statusCode,
            message,
            ...(config.env === 'development' && { stack: err.stack }),
        };

        if (config.env === 'development') {
            logger.error(err);
        }

        res.status(statusCode).send(response);
    } else {
        const error = err;
        const statusCode =
            error instanceof mongoose.Error
                ? httpStatus.BAD_REQUEST
                : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        next(new ApiError(statusCode, message, false, err.stack));
    }
};

export { errorHandler };
