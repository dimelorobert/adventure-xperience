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
        'Please, the name field is required and cannot be longer than 30 characters.',
        400
      )
    ),

  description: Joi.string()
    .max(500)
    .required()
    .error(
      helpers.errorGenerator(
        'Please, the description field is required and cannot be longer than 500 characters.',
        400
      )
    ),
  image: Joi.string()
    .max(50)
    .required()
    .error(
      helpers.errorGenerator(
        'Please, insert the image url in this field and cannot be longer than 50 characters,in the otherwise use shortlinks',
        400
      )
    ),
  video: Joi.string().uri().trim(),
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .max(99999)
    .error(helpers.errorGenerator(`You must type a valid price. ex: 99.99`, 400)),
  country: Joi.string()
    .max(30)
    .required()
    .error(helpers.errorGenerator('Please, fill with a valid country.', 400)),
  city: Joi.string()
    .max(30)
    .required()
    .error(helpers.errorGenerator('Please, fill with a valid city.', 400)),
  vacancy: Joi.number()
    .positive()
    .precision(2)
    .max(999999)
    .required()
    .error(helpers.errorGenerator(`You must type a valid price. ex: 99.99`, 400)),
  date_selected: Joi.date().format('YYYY-MM-DD').utc()
});

module.exports = {
  adventureSchema
};
