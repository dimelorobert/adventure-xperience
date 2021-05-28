import model from "../../../../database/model";
import logger from "../../../../utils/helpers/logger";
import chalk from "chalk";
import response from "../../../../routes/response";

const TABLE = "users";

const middlewares = {
	async emailChecker(req, res, next) {
		//
		const { email } = req.body;

		const emailExists = await model.findOne(TABLE, { email: email });

		if (emailExists) {
			logger.error(
				chalk.red("[ Middleware EmailExist ]: El email ya esta registrado"),
			);

			return response.error(
				req,
				res,
				{ message: "El email ya esta registrado" },
				409,
			);
		}
		next();
	},

	async userChecker(req, res, next) {
		let customError = {
			status: 410,
			message: "Recurso no disponible"
		};
		

		const { id } = req.params;

		// check if user already exist
		const userExists = await model.findOne(TABLE, { id: id });

		if (!userExists) {
			logger.error(chalk.red("[ Middleware userExist ]: El usuario no existe"));

			return response.error(req, res, "customError", 404);
		}
		next();
	}

	
	
};

/*async function user(req, res, next) {
	//
	if (req.method === "POST") {
		const { email } = req.body;

		const emailExists = await model.findOne(TABLE, { email: email });

		if (emailExists) {
			logger.error(chalk.red("[ Middleware EmailExist ]: El email ya esta registrado"));

			return response.error(
				req,
				res,
				{ message: "El email ya esta registrado" },
				409,
			);
		}
	} else {
		//
		let customError = {};
		if (req.method === "DELETE") {
			req.status = 410;
			customError.message = "Recurso no disponible";
		} else {
			req.status = 404;
			customError.message = "Pagina no encontrada";
			customError.comment = "¿Te has Perdido?";
		}
		//

		const { id } = req.params;

		// check if user already exist
		const userExists = await model.findOne(TABLE, { id: id });

		if (!userExists) {
			logger.error(chalk.red("[ Middleware userExist ]: El usuario no existe"));

			return response.error(req, res, customError, req.status);
		}
	}

	return next();
}*/

export default middlewares;
