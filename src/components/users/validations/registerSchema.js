import Joi from "joi";

const registerSchema = Joi.object().keys({
  email: Joi.string().email().required().trim().messages({
    "string.email": "Debes introducir un email valido",
    "string.required": "El camppo email es obligatorio",
    "string.trim": "El email no debe contener espacios",
  }),
  password: Joi.string()
    .min(6)
    .max(16)
    .alphanum()
    .trim()
    .pattern(new RegExp("^[A-z0-9]{6,16}$"))
    .required()
    .messages({
      "string.empty": "La contraseña no debe estar vacía",
      "string.alphanum": "La contraseña solo permite caracteres alfanúmericos",
      "string.trim": "La contraseña no debe contener espacios",
      "string.required": "El campo contraseña es obligatorio",
      "string.min": "La contraseña debe tener mínimo 6 cáracteres",
      "string.max": "La contraseña debe tener máximo 16 cáracteres",
    }),
});

export default registerSchema;
