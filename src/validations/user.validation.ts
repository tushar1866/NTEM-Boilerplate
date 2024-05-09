import Joi from 'joi';
import { password, objectId } from './custom.validation';

const createUser: Joi.ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
  role: Joi.string().required().valid('user', 'admin'),
});

const getUsers: Joi.ObjectSchema = Joi.object().keys({
  name: Joi.string(),
  role: Joi.string(),
  sortBy: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
});

const getUser: Joi.ObjectSchema = Joi.object().keys({
  userId: Joi.string().custom(objectId),
});

const updateUser: Joi.ObjectSchema = Joi.object().keys({
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
});

const deleteUser: Joi.ObjectSchema = Joi.object().keys({
  userId: Joi.string().custom(objectId),
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
