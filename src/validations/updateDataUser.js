'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const JoiAge = Joi.extend(require('joi-age'));
const {
     helpers
} = require('../helpers');

const updateDataUsersSchema = Joi.object().keys({
     name: Joi.string()
          .min(3)
          .max(30)
          .required()
          .error(
               helpers.errorGenerator(
                    'El campo nombre es obligatorio y no puede exceder mas de 30 caracteres',
                    400
               )
          ),
     surname: Joi.string()
          .min(3)
          .max(60)
          .required()
          .error(
               helpers.errorGenerator(
                    'El campo nombre es obligatorio y no puede exceder mas de 60 caracteres.',
                    400
               )
          ),
     
     country: Joi.any(),
          
     city: Joi.any(),
     genre: Joi.any(),

     image: Joi.any(),
});

module.exports = {
     updateDataUsersSchema
};