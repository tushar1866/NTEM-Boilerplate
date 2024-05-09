import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from './config';
import { TokenTypes } from './tokens';
import { User } from '../models';
import { JWTPayload } from '../types/user';
import { DoneCallback } from 'passport';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: JWTPayload, done: DoneCallback) => {
  try {
    if (payload.type !== TokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload._id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
