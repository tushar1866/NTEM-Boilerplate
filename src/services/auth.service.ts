// import httpStatus from 'http-status';
// import tokenService from './token.service';
// import userService from './user.service';
// import Token from '../models/token.model';
// import ApiError from '../utils/ApiError';
// import { TokenTypes } from '../config/tokens';
// import { Document } from 'mongoose';
// import { IToken } from '../types/token';

// /**
//  * Login with username and password
//  * @param {string} email
//  * @param {string} password
//  * @returns {Promise<User>}
//  */
// const loginUserWithEmailAndPassword = async (email:string, password:string) => {
//   const user = await userService.getUserByEmail(email);
//   if (!user || !(await user.isPasswordMatch(password))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
//   }
//   return user;
// };

// /**
//  * Logout
//  * @param {string} refreshToken
//  * @returns {Promise}
//  */
// const logout = async (refreshToken:string) => {
//   const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: TokenTypes.REFRESH, blacklisted: false });
//   if (!refreshTokenDoc) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
//   }
//   await refreshTokenDoc.deleteOne();
// };

// /**
//  * Refresh auth tokens
//  * @param {string} refreshToken
//  * @returns {Promise<Object>}
//  */
// const refreshAuth = async (refreshToken:string): Promise<object> => {
//   try {
//     const refreshTokenDoc:Document<IToken>|Error = await tokenService.verifyToken(refreshToken, TokenTypes.REFRESH);
//     const user = await userService.getUserById(refreshTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await refreshTokenDoc.();
//     return tokenService.generateAuthTokens(user);
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
//   }
// };

// /**
//  * Reset password
//  * @param {string} resetPasswordToken
//  * @param {string} newPassword
//  * @returns {Promise}
//  */
// const resetPassword = async (resetPasswordToken, newPassword) => {
//   try {
//     const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, TokenTypes.RESET_PASSWORD);
//     const user = await userService.getUserById(resetPasswordTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await userService.updateUserById(user.id, { password: newPassword });
//     await Token.deleteMany({ user: user.id, type: TokenTypes.RESET_PASSWORD });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
//   }
// };

// /**
//  * Verify email
//  * @param {string} verifyEmailToken
//  * @returns {Promise}
//  */
// const verifyEmail = async (verifyEmailToken) => {
//   try {
//     const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, TokenTypes.VERIFY_EMAIL);
//     const user = await userService.getUserById(verifyEmailTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await Token.deleteMany({ user: user.id, type: TokenTypes.VERIFY_EMAIL });
//     await userService.updateUserById(user.id, { isEmailVerified: true });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
//   }
// };

// export default {
//   loginUserWithEmailAndPassword,
//   logout,
//   refreshAuth,
//   resetPassword,
//   verifyEmail,
// };
