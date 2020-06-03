'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const { errorGenerator } = require('../helpers');

const reviewSchema = Joi.object({
  points: Joi.number()
    .max(5)
    .error(errorGenerator(`You must type a valid price. ex: 99.99`, 400)),
  comments: Joi.string()
    .max(500)
    .required()
    .error(
      errorGenerator(
        'Please, the description field is required and cannot be longer than 500 characters.',
        400
      )
    ),
  date_post: Joi.date().format('YYYY-MM-DD').utc()
});

module.exports = { reviewSchema };
