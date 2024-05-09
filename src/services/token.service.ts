// import jwt from 'jsonwebtoken';
// import moment, { Moment } from 'moment';
// import httpStatus from 'http-status';
// import config from '../config/config';
// import userService from './user.service';
// import { Token } from '../models';
// import ApiError from '../utils/ApiError';
// import { TokenTypes } from '../config/tokens';
// import { Document, ObjectId } from 'mongoose';
// import { IToken } from '../types/token';
// import { IUser } from '../types/user';

// /**
//  * Generate token
//  * @param {ObjectId} userId
//  * @param {Moment} expires
//  * @param {string} type
//  * @param {string} [secret]
//  * @returns {string}
//  */
// const generateToken = (userId: ObjectId, expires: Moment, type: string, secret: string = config.jwt.secret): string => {
//   const payload = {
//     sub: userId,
//     iat: moment().unix(),
//     exp: expires.unix(),
//     type,
//   };
//   return jwt.sign(payload, secret);
// };

// /**
//  * Save a token
//  * @param {string} token
//  * @param {ObjectId} userId
//  * @param {Moment} expires
//  * @param {string} type
//  * @param {boolean} [blacklisted]
//  * @returns {Promise<Token>}
//  */
// const saveToken = async (
//   token: string,
//   userId: ObjectId,
//   expires: Moment,
//   type: string,
//   blacklisted: boolean = false
// ): Promise<IToken> => {
//   const tokenDoc = await Token.create({
//     token,
//     user: userId,
//     expires: expires.toDate(),
//     type,
//     blacklisted,
//   });
//   return tokenDoc;
// };

// /**
//  * Verify token and return token doc (or throw an error if it is not valid)
//  * @param {string} token
//  * @param {string} type
//  * @returns {Promise<Token>}
//  */
// const verifyToken = async (token: string, type: string): Promise<Document<IToken> | Error> => {
//   const payload = jwt.verify(token, config.jwt.secret);
//   const tokenDoc:Document<IToken> = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
//   if (!tokenDoc) {
//     throw new Error('Token not found');
//   }
//   return tokenDoc;
// };

// /**
//  * Generate auth tokens
//  * @param {User} user
//  * @returns {Promise<Object>}
//  */
// const generateAuthTokens = async (user: IUser): Promise<object> => {
//   const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
//   const accessToken = generateToken(user._id, accessTokenExpires, TokenTypes.ACCESS);

//   const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
//   const refreshToken = generateToken(user._id, refreshTokenExpires, TokenTypes.REFRESH);
//   await saveToken(refreshToken, user._id, refreshTokenExpires, TokenTypes.REFRESH);

//   return {
//     access: {
//       token: accessToken,
//       expires: accessTokenExpires.toDate(),
//     },
//     refresh: {
//       token: refreshToken,
//       expires: refreshTokenExpires.toDate(),
//     },
//   };
// };

// /**
//  * Generate reset password token
//  * @param {string} email
//  * @returns {Promise<string>}
//  */
// const generateResetPasswordToken = async (email: string): Promise<string> => {
//   const user = await userService.getUserByEmail(email);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
//   }
//   const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
//   const resetPasswordToken = generateToken(user.id, expires, TokenTypes.RESET_PASSWORD);
//   await saveToken(resetPasswordToken, user.id, expires, TokenTypes.RESET_PASSWORD);
//   return resetPasswordToken;
// };

// /**
//  * Generate verify email token
//  * @param {User} user
//  * @returns {Promise<string>}
//  */
// const generateVerifyEmailToken = async (user: IUser): Promise<string> => {
//   const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
//   const verifyEmailToken = generateToken(user._id, expires, TokenTypes.VERIFY_EMAIL);
//   await saveToken(verifyEmailToken, user._id, expires, TokenTypes.VERIFY_EMAIL);
//   return verifyEmailToken;
// };

// export default {
//   generateToken,
//   saveToken,
//   verifyToken,
//   generateAuthTokens,
//   generateResetPasswordToken,
//   generateVerifyEmailToken,
// };