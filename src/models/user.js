'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const JoiAge = Joi.extend(require('joi-age'));
const { errorGenerator } = require('../helpers');

const usersSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .error(
      errorGenerator(
        'Please, the name field is required and cannot be longer than 30 characters.',
        400
      )
    ),
  surname: Joi.string()
    .min(3)
    .max(60)
    .required()
    .error(
      errorGenerator(
        'Please, the surname field is required and cannot be longer than 60 characters.',
        400
      )
    ),
  date_birth: JoiAge.date().required(),
  address: Joi.string().max(60),
  country: Joi.string()
    .max(30)
    .required()
    .error(errorGenerator('Please, fill with a valid country.', 400)),
  city: Joi.string()
    .max(30)
    .required()
    .error(errorGenerator('Please, fill with a valid city.', 400)),
  nickname: Joi.string()
    .min(3)
    .max(20)
    .required()
    .error(
      errorGenerator(
        'Please, the nickname field is required and cannot be longer than 20 characters.',
        400
      )
    ),
  email: Joi.string()
    .email()
    .required()
    .error(errorGenerator('please, Insert a valid email.', 400)),
  password: Joi.string()
    .min(3)
    .max(16)
    .required()
    .error(
      errorGenerator(
        'Please, the password field is required and cannot be longer than 16 characters.',
        400
      )
    ),
  avatar: Joi.string()
    .max(60)
    .required()
    .error(
      errorGenerator(
        'Please, upload your avatar or insert the image url in this field and cannot be longer than 60 characters,in the otherwise use shortlinks',
        400
      )
    ),
  creation_date: Joi.date().format('YYYY-MM-DD').utc(),
  updating_date: Joi.date().format('YYYY-MM-DD').utc()
});

module.exports = {
  usersSchema
};
