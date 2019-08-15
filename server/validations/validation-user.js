'use strict';

import Joi from '@hapi/joi';

export const loginValidationSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).max(255).required()
  });

export const signUpSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).max(255).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  });

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(6).max(255).required(),
    newPassword: Joi.string().invalid(Joi.ref('oldPassword')).min(6).max(255).required(),
    confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  });

export const updateSchema = Joi.object({
    name: Joi.string().max(255).optional().allow(''),
    phone: Joi.string().regex(/(^0[0-9])+([0-9]{8})\b$/).optional().allow(''),
    email: Joi.string().email().lowercase().optional().allow(''),
    address: Joi.string().optional().allow('')
  });  