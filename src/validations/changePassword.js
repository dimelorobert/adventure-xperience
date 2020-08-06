'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const {
   helpers
} = require('../helpers');

const newPasswordSchema = Joi.object().keys({
   oldPassword: Joi.string()
      .min(3)
      .max(16)
      //.regex(/^[a-zA-Z0-9]{3,36}$/)
      .required()
      .error(
         helpers.errorGenerator(
            'El campo password es obligatorio, no admite caracteres especiales y no debe exceder más de 16 caracteres',
            400
         )
      ),
   newPassword: Joi.string()
      .min(3)
      .max(16)
      //.regex(/^[a-zA-Z0-9]{3,36}$/)
      .required()
      .error(
         helpers.errorGenerator(
            'El campo password es obligatorio, no admite caracteres especiales y no debe exceder más de 16 caracteres',
            400
         )
      ),
   newPasswordRepeat: Joi.string()
      .min(3)
      .max(16)
      //.regex(/^[a-zA-Z0-9]{3,36}$/)
      .error(
         helpers.errorGenerator(
            'El campo password no coincide, no debe exceder más de 16 caracteres y no admite caracteres especiales ',
            400
         )
      ),


});

module.exports = {
   newPasswordSchema
};