'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const { errorGenerator } = require('../helpers');

const chatSchema = Joi.object({
  message: Joi.string()
    .min(5)
    .max(500)
    .error(
      errorGenerator('Please,your message is too longer max. 500 characteres')
    ),
  date_post: Joi.date().format('YYYY-MM-DD').utc()
});

module.exports = { chatSchema };
