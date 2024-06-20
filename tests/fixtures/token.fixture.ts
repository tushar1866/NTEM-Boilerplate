import moment from 'moment';
import config from '../../src/config/config';
import { TokenTypes } from '../../src/config/tokens';
import tokenService from '../../src/services/token.service';
import { userOne, admin } from './user.fixture';

const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
);
const userOneAccessToken = tokenService.generateToken(
    userOne._id,
    accessTokenExpires,
    TokenTypes.ACCESS
);
const adminAccessToken = tokenService.generateToken(
    admin._id,
    accessTokenExpires,
    TokenTypes.ACCESS
);

export default {
    userOneAccessToken,
    adminAccessToken,
};
