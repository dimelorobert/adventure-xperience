'use strict';
const Joi = require('@hapi/joi');

const { errorGenerator } = require('../helpers');

const adventuresSchema = Joi.object({
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

  description: Joi.string()
    .max(500)
    .required()
    .error(
      errorGenerator(
        'Please, this field is required and cannot be longer than 500  characters.',
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
  price: Joi.number()
    .positive()
    .precision(2)
    .max(999999)
    .error(errorGenerator(`You must type a valid price. ex: 99.99`, 400)),
  country: Joi.string()
    .max(60)
    .required()
    .error(errorGenerator('Please, fill with a valid country.', 400)),
  city: Joi.string()
    .max(60)
    .required()
    .error(errorGenerator('Please, fill with a valid city.', 400)),
  vacancy: Joi.number()
    .positive()
    .precision(2)
    .max(999999)
    .required()
    .error(errorGenerator(`You must type a valid price. ex: 99.99`, 400))
});

module.exports = {
  adventuresSchema
};
