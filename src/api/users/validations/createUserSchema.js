import Joi from "@hapi/joi";

const createUserSchema = Joi.object({
	email: Joi.string()
		.email()
		.pattern(new RegExp("^[.A-z0-9-_+]+@[A-Za-z0-9-_=]+.[A-z]{3}$"))
		.required()
		.trim()
		.empty()
		.messages({
			"string.email": "Debes introducir un email valido",
			"string.pattern.base": "El email no esta bien formado",
			"string.required": "El campo email es obligatorio",
			"string.trim": "El campo email no debe contener espacios",
			"string.empty": "El campo email no debe estar vacio",
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
			"string.alphanum":
				"La contraseña solo permite caracteres alfanúmericos",
			"string.trim": "La contraseña spaciosno debe contener e",
			"string.pattern.base":
				"La contraseña debe de tener un mínimo de 6 y un máximo de 16 cáracteres",
			"string.required": "El campo contraseña es obligatorio",
			"string.min": "La contraseña es muy corta",
			"string.max": "La contraseña debe tener máximo 16 cáracteres",
		}),
});

const createUserData = (request, response, next) => {
	let result = createUserSchema.validate(request.body, {
		abortEarly: false,
	});

	if (result.error === undefined) {
		next();
		return;
	} else {
		const validationErrors = result.error.details.reduce((acc, error) => {
			return acc + `[${error.message}]`;
		}, "");

		return response.status(400).send({
			message: `Por favor corrige la siguiente información : ${validationErrors}`,
		});
	}
};

export default createUserData;
