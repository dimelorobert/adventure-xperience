'use strict';

'use strict';
const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

const {
  helpers
} = require('../helpers');

const categorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(60)
    .required()
    .trim()
    .error(
      helpers.errorGenerator(
        'Please, this field is required and cannot be longer than 60 characters.',
        400
      )
    ),
  image: Joi.string(),
  date_creation: Joi.date().format('YYYY-MM-DD').utc()
});

module.exports = {
  categorySchema
};