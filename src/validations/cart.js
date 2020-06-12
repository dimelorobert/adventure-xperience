'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
// const { errorGenerator } = require('../helpers');

const cartSchema = Joi.object({
  date_selected: Joi.date().format('YYYY-MM-DD').utc(),
  purchased_date: Joi.date().format('YYYY-MM-DD').utc(),
  price: Joi.number().positive().precision(2).required().max(99999)
});

module.exports = { cartSchema };
