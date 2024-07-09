import Joi from 'joi';
import mongoose from 'mongoose';

const objectId: Joi.CustomValidator = (value, helpers) => {
    const filtered = mongoose.Types.ObjectId.isValid(value);
    return !filtered
        ? helpers.message({ custom: 'Must be valid mongo objectId' })
        : value;
};

const password: Joi.CustomValidator = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message({
            custom: 'password must be at least 8 characters',
        });
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message({
            custom: 'password must contain at least 1 letter and 1 number',
        });
    }
    return value;
};

export { objectId, password };
