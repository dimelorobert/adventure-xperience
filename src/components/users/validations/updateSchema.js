import Joi from "joi";
import helpers from "../../../helpers";

const updateSchema = Joi.object().keys({
  image: Joi.any(),
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .error(
      helpers.errorGenerator(
        "El campo nombre es obligatorio y no puede exceder mas de 30 caracteres",
        400
      )
    ),
  surname: Joi.string()
    .min(3)
    .max(60)
    .required()
    .error(
      helpers.errorGenerator(
        "El campo nombre es obligatorio y no puede exceder mas de 60 caracteres.",
        400
      )
    ),
  address: Joi.string(),
  telephone: Joi.number(),

  city: Joi.string()
    .max(30)
    .required()
    .error(
      helpers.errorGenerator(
        "El campo ciudad es obligatorio, introduce un ciudad",
        400
      )
    ),
  country: Joi.string()
    .max(30)
    .required()
    .error(
      helpers.errorGenerator(
        "El campo país es obligatorio, introduce un país",
        400
      )
    ),
});

export default updateSchema;
