'use strict';

'use strict';
const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

const {
  helpers
} = require('../helpers');

const categoriesSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(60)
    .required()
    .trim()
    .error(
      helpers.errorGenerator(
        'El campo nombre es requerido por tanto no puede ir vacio ni exceder max de 60 caracteres.',
        400
      )
    ),
  image: Joi.string(),
  date_creation: Joi.date().format('YYYY-MM-DD').utc()
});

module.exports = {
  categoriesSchema
};