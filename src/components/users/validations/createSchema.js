"use strict";

import Joi from "joi";

const createSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .empty("")
    .allow("")
    .trim()
    .options({
      convert: false,
    })
    .messages({
      "string.email": "Debes introducir un email valido",
      "string.trim": "El email no debe contener espacios",
    }),

  password: Joi.string()
    .min(6)
    .max(16)
    .alphanum()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .trim()
    .messages({
      "string.empty": "El campo password no debe estar vacío",
      "string.required": "El campo password no debe estar vacío",
    }),
});

export default createSchema;
