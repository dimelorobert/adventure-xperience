'use strict';

import Joi from '@hapi/joi';
import helpers from '../../helpers';
import sanitizeHtml from 'sanitize-html';

const createSchema = Joi.object().keys({
  name: Joi.string()
    .sanitize(sanitizeHtml)
    .min(3)
    .max(30)
    .required()
    .error(
      helpers.errorGenerator(
        'El campo nombre es obligatorio y no puede exceder mas de 30 caracteres',
        400,
      ),
    ),
  surname: Joi.string()
    .min(3)
    .max(60)
    .required()
    .error(
      helpers.errorGenerator(
        'El campo nombre es obligatorio y no puede exceder mas de 60 caracteres.',
        400,
      ),
    ),
  date_birth: Joi.date()
    .required()
    .error(helpers.errorGenerator('Introduce tu fecha de nacimiento', 400)),
  country: Joi.string()
    .max(30)
    .required()
    .error(
      helpers.errorGenerator(
        'El campo país es obligatorio, introduce un país',
        400,
      ),
    ),
  city: Joi.string()
    .max(30)
    .required()
    .error(
      helpers.errorGenerator(
        'El campo ciudad es obligatorio, introduce un ciudad',
        400,
      ),
    ),

  email: Joi.string()
    .email()
    .required()
    .error(helpers.errorGenerator('El campo email es obligatorio', 400)),
  password: Joi.string()
    .min(3)
    .max(16)
    .regex(/^[a-zA-Z0-9]{3,36}$/)
    .required()
    .error(
      helpers.errorGenerator(
        'El campo password es obligatorio, no admite caracteres especiales y no debe exceder más de 16 caracteres',
        400,
      ),
    ),

  image: Joi.any(),

  role: Joi.string(),
  creation_date: Joi.date().format('YYYY-MM-DD').utc(),
  modify_date: Joi.date().format('YYYY-MM-DD').utc(),
  ip: Joi.string().max(50),
});

export default createSchema;
