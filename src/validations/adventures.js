'use strict';
const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const JoiAge = Joi.extend(require('joi-age'));
const {
  helpers
} = require('../helpers');


const adventuresSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .trim()
    .error(
      helpers.errorGenerator(
        'El campo nombre es requerido por tanto no puede ir vacio ni exceder max de 30 caracteres',
        400
      )
    ),

  description: Joi.string()
    .max(500)
    .required()
    .error(
      helpers.errorGenerator(
        'El campo Descripción es requerido por tanto no puede ir vacio ni exceder max de 500 caracteres',
        400
      )
    ),
  image: Joi.string(),
  price: Joi.number()
    .positive()
    .precision(2)
    .max(99999),

  country: Joi.string()
    .max(30)
    .required()
    .error(helpers.errorGenerator('Por favor rellena este campo con un país valido.', 400)),
  city: Joi.string()
    .max(30)
    .required()
    .error(helpers.errorGenerator('Por favor rellena este campo con una ciudad valida.', 400)),
  vacancy: Joi.number()
    .min(0)
    .max(10)
    .required()
    .error(helpers.errorGenerator(`Introduce un formato de plazas disponibles valido `, 400)),
  isAvailable: Joi.string(),
  image: Joi.any(),
  creation_date: Joi.date().format('YYYY-MM-DD').utc(),
  modify_date: Joi.date().format('YYYY-MM-DD').utc(),
  date_selected: Joi.date().format('YYYY-MM-DD').utc(),
  category_id: Joi.number()
    .positive()
    .min(1)
    .required()
    .error(helpers.errorGenerator('Por favor selecciona una categoria ', 400)),
  start_date_event: Joi.date().format('YYYY-MM-DD').utc(),
});

module.exports = {
  adventuresSchema
};