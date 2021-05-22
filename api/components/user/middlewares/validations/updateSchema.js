import Joi from "joi";

const updateUserSchema = Joi.object({
	name: Joi.string().min(3).max(30).trim().allow("").messages({
		"string.min": "El nombre debe tener mínimo 3 cáracteres",
		"string.max": "El nombre no debe exceder de 30 cáracteres",
		"string.trim": "El nombre no debe contener espacios",
	}),

	surname: Joi.string().min(3).max(60).trim().allow("").messages({
		"string.min": "El apellido debe tener mínimo 3 cáracteres",
		"string.max": "El apellido no debe exceder de 60 cáracteres",
		"string.trim": "El apellido no debe contener espacios",
	}),

	address: Joi.string().min(15).max(255).trim().allow("").messages({
		"string.min": "La dirección debe tener mínimo 15 cáracteres",
		"string.max": "La dirección no debe exceder de 60 cáracteres",
		"string.trim": "La dirección no debe contener espacios",
	}),

	telephone: Joi.number().min(9).max(20).allow("").messages({
		"string.min": "El telefono no debe exceder de 9 cáracteres",
		"string.max": "El telefono no debe exceder de 20 cáracteres",
	}),

	city: Joi.string().min(2).max(30).allow("").messages({
		"string.min": "La ciudad no debe exceder de 2 cáracteres",
		"string.max": "La ciudad no debe exceder de 30 cáracteres",
	}),
	country: Joi.string().min(2).max(30).allow("").messages({
		"string.min": "El país debe tener mínimo 2 cáracteres",
		"string.max": "El país no debe exceder de 30 cáracteres",
	}),
});

const updateSchema = (request, response, next) => {
	let result = updateUserSchema.validate(request.body, {
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

export default updateSchema;
