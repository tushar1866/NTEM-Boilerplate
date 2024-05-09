import Joi from 'joi';

const objectId: Joi.CustomValidator = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({ _id: '"{{#label}}" must be a valid mongo id' });
  }
  return value;
};

const password: Joi.CustomValidator = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message({ password: 'password must be at least 8 characters' });
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message({ password: 'password must contain at least 1 letter and 1 number' });
  }
  return value;
};

export { objectId, password };
