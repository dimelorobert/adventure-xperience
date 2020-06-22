'use strict';
const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const { helpers } = require('../helpers');

const adventureSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
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
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .max(99999)
    .error(helpers.errorGenerator(`Introduce un formato de precio valido ej: 99.99`, 400)),
  country: Joi.string()
    .max(30)
    .required()
    .error(helpers.errorGenerator('Por favor rellena este campo con un país valido.', 400)),
  city: Joi.string()
    .max(30)
    .required()
    .error(helpers.errorGenerator('Por favor rellena este campo con una ciudad valida.', 400)),
  vacancy: Joi.number()
    .positive()
    .max(100)
    .required()
    .error(helpers.errorGenerator(`Introduce un formato de plazas disponibles valido `, 400)),
  isAvailable: Joi.string()
  .max(20)
  .required()
  .error(helpers.errorGenerator('Este campo no puede ir vacio, Por favor selecciona una opcion valida para este campo', 400)),
  creation_date: Joi.date().format('YYYY-MM-DD').utc(),
  modify_date: Joi.date().format('YYYY-MM-DD').utc(),
  date_selected: Joi.date().format('YYYY-MM-DD').utc()
});

module.exports = {
  adventureSchema
};
