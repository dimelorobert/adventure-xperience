import model from "../../../../database/model";
import logger from "../../../../utils/helpers/logger";
import chalk from "chalk";

async function userChecker(request, response, next) {
	const { id } = request.params;

	// check if user already exist
	const userExists = await model.findOne("users", { id: id });
	if (!userExists) {
		logger.error(chalk.red("[Middleware]: El usuario no existe"));

		return response.status(409).send({
			message: "El usuario no existe",
		});
	}

	return next();
}

export default userChecker;
