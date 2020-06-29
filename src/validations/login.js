'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const {
   helpers
} = require('../helpers');

const loginSchema = Joi.object().keys({
   email: Joi.string()
      .email()
      .trim()
      .required()
      .error(helpers.errorGenerator('El campo email es obligatorio', 400)),
   password: Joi.string()
      .min(3)
      .max(16)
      .trim()
      .required()
      .error(
         helpers.errorGenerator(
            'El campo password es obligatorio y no debe exceder más de 16 caracteres',
            400
         )
      )
});

module.exports = {
   loginSchema
};