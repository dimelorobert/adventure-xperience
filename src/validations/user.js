'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const JoiAge = Joi.extend(require('joi-age'));
const {
  helpers
} = require('../helpers');

const userSchema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .error(
      helpers.errorGenerator(
        'El campo nombre es obligatorio y no puede exceder mas de 30 caracteres',
        400
      )
    ),
  surname: Joi.string()
    .min(3)
    .max(60)
    .required()
    .error(
      helpers.errorGenerator(
        'El campo nombre es obligatorio y no puede exceder mas de 60 caracteres.',
        400
      )
    ),
  date_birth: JoiAge.date().required().error(helpers.errorGenerator('Introduce tu fecha de nacimiento', 400)),
  country: Joi.string()
    .max(30)
    .required()
    .error(helpers.errorGenerator('El campo país es obligatorio, introduce un país', 400)),
  city: Joi.string()
    .max(30)
    .required()
    .error(helpers.errorGenerator('El campo ciudad es obligatorio, introduce un ciudad', 400)),
  nickname: Joi.string()
    .min(3)
    .max(20)
    .required()
    .error(
      helpers.errorGenerator(
        'El campo nickname es obligatorio y no puede exceder más de 20 caracteres',
        400
      )
    ),
  role: Joi.string(),
  email: Joi.string()
    .email()
    .required()
    .error(helpers.errorGenerator('El campo email es obligatorio', 400)),
  password: Joi.string()
    .min(3)
    .max(16)
    .required()
    .error(
      helpers.errorGenerator(
        'El campo password es obligatorio y no debe exceder más de 16 caracteres',
        400
      )
    ),
  creation_date: Joi.date().format('YYYY-MM-DD').utc(),
  ip: Joi.string().max(50)
});

module.exports = {
  userSchema
};