import Joi from "@hapi/joi";

const uploadURLImageSchema = Joi.object({
  image: Joi.string()
    .pattern(
      new RegExp("^https?://[.a-z0-9-_]+.[a-z]{2,3}/[A-Za-z0-9-_=]+.[A-z]{3}$")
    )
    .messages({
      "string.pattern.base": "La url donde se aloja la imagen no es valida",
    }),
});

export default uploadURLImageSchema;
