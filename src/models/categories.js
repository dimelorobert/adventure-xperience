'use strict';

'use strict';
const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

const { errorGenerator } = require('../helpers');

const categoriesSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(60)
    .required()
    .error(
      errorGenerator(
        'Please, this field is required and cannot be longer than 60 characters.',
        400
      )
    ),
  image: Joi.string()
    .max(500)
    .required()
    .error(
      errorGenerator(
        'Please, this field is required and cannot be longer than 500  characters.',
        400
      )
    ),
  date_creation: Joi.date().format('YYYY-MM-DD').utc()
});

module.exports = {
  categoriesSchema
};
