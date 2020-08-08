'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const {
  helpers
} = require('../helpers');

const reviewsSchema = Joi.object({
  points: Joi.number()
    .min(1)
    .max(5)
    .integer()
    .required()
    .error(
      helpers.errorGenerator(`El campo voto es obligatorio , revisa si has dado una votación entre 1 y 5`, 400)
    ),
  comments: Joi.string()
    .max(500)
    .required()
    .error(
      helpers.errorGenerator(
        'El campo comentarios es obligatorio',
        400
      )
    ),
  date_post: Joi.date().format('YYYY-MM-DD').utc(),
  ip: Joi.string()
    .max(50)
});

module.exports = {
  reviewsSchema
};