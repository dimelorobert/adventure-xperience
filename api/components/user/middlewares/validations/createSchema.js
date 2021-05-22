import Joi from "joi";

const createUserSchema = Joi.object({
	email: Joi.string()
		.email()
		.empty()
		.lowercase()
		.pattern(new RegExp("^[.A-z0-9-_+]+@+[A-Za-z0-9-_=]+.[A-z]{3}$"))
		.required()
		.trim()
		.messages({
			"string.email": "Debes introducir un email valido",
			"string.empty": "El email no debe estar vacio",
			"string.lowercase": "El email no admite mayusculas",
			"string.pattern.base": "El email no esta bien formado",
			"string.required": "El email es obligatorio",
			"string.trim": "El email no debe contener espacios",
		}),
	password: Joi.string()
		.alphanum()
		.empty()
		.min(6)
		.max(16)
		.pattern(new RegExp("^[A-z0-9]{6,16}$"))
		.required()
		.trim()
		.messages({
			"string.alphanum":
				"La contraseña solo permite caracteres alfanúmericos",
			"string.empty": "La contraseña no debe estar vacía",
			"string.min": "La contraseña es muy corta",
			"string.max": "La contraseña debe tener máximo 16 cáracteres",
			"string.pattern.base":
				"La contraseña debe de tener un mínimo de 6 y un máximo de 16 cáracteres",
			"string.required": "El campo contraseña es obligatorio",
			"string.trim": "La contraseña no debe contener espacios",
		}),
});

const createSchema = (request, response, next) => {
	let result = createUserSchema.validate(request.body, {
		abortEarly: false,
	});

	if (result.error === undefined) {
		next();
		// return;
	} else {
		const validationErrors = result.error.details.reduce((acc, error) => {
			acc.push(`${error.message}`);
			return acc;
		}, []);

		return response.status(400).send({
			message: validationErrors,
		});
	}
};

export default createSchema;
