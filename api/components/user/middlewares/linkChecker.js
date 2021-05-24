import model from "../../../../database/model";
import logger from "../../../../utils/helpers/logger";
import chalk from "chalk";
import response from "../../../../routes/response";
const TABLE = "users";

async function linkChecker(req, res, next) {
	//
	const { id } = req.params;

	// check if code was already used
	const { activation_code } = await model.findOne(TABLE, { id: id });

	if (activation_code === null) {
		logger.error(
			chalk.red(
				"[Link Middleware]: No dispones de un codigo de activación, solicita uno para activar la cuenta",
			),
		);
		return response.error(
			req,
			res,
			{
				message:
					"No dispones de un codigo de activación, solicita uno para activar la cuenta",
			},
			410,
		);
	}

	if (activation_code === "expired") {
		logger.error(
			chalk.red("[Link Middleware]: El link de activación ha expirado"),
		);
		return response.error(
			req,
			res,
			{
				message: "El link de activación ha expirado",
			},
			410,
		);
	}
	next();
}

export default linkChecker;
