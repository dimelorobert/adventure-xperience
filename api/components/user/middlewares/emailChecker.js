import model from "../../../../database/model";
import logger from "../../../../utils/helpers/logger";
import chalk from "chalk";

async function emailChecker(request, response, next) {
	const { email } = request.body;
	// check if email already exist
	const emailExists = await model.findOne("users", { email: email });

	if (emailExists) {
		logger.error(chalk.red("[Middleware]: El email ya esta registrado"));

		return response.status(409).send({
			message: "El email ya esta registrado",
		});
	}
	return next();
}

export default emailChecker;
