'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const JoiAge = Joi.extend(require('joi-age'));
const {
     helpers
} = require('../helpers');

const updateDataUsersSchema = Joi.object().keys({
     name: Joi.any(),
     surname: Joi.any(),
     date_birth: Joi.any(),
     country: Joi.any(),
     city: Joi.any(),
     email: Joi.any(),
     password: Joi.any(),
     image: Joi.any(),
});

module.exports = {
     updateDataUsersSchema
};