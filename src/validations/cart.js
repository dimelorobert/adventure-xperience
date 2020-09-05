'use strict';
const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

const {
   helpers
} = require('../helpers');

const cartSchema = Joi.object({
   quantity: Joi.number()
      .min(0)
      .max(10)
      .positive()
      .required()
      .error(helpers.errorGenerator(`Introduce un formato de plazas disponibles valido `, 400)),
   status: Joi.string()
      .required()
      .error(
         helpers.errorGenerator(
            'Por favor , selecciona una opción',
            400
         )),
   adventure_id: Joi.number()
      .min(1)
      .positive()
      .required()
      .error(helpers.errorGenerator(`Id erroneo`, 400)),

});

module.exports = {
   cartSchema
};