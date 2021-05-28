import model from "../../../../database/model";
import logger from "../../../../utils/helpers/logger";
import chalk from "chalk";
import response from "../../../../routes/response";
const TABLE = "users";

const linkChecker = {
	activate: async (req, res, next) => {
		//
		const { id } = req.params;

		// check if code was already used
		const { activation_code } = await model.findOne(TABLE, { id: id });

		if (activation_code === null) {
			logger.error(
				chalk.red("[Link Middleware]: Código de activación expirado"),
			);
			return response.error(
				req,
				res,
				{
					message: "Código de activación expirado",
				},
				410,
			);
		}

		next();
	},

	deactivate: async (req, res, next) => {
		//
		const { id } = req.params;

		// check if code was already used
		const { is_account_active, activation_code } = await model.findOne(
			TABLE,
			{ id: id },
		);

		//
		if (is_account_active === 0 && activation_code === null) {
			logger.error(
				chalk.red("[Link Middleware]:La cuenta esta descativada"),
			);
			return response.error(
				req,
				res,
				{
					message:
						"La cuenta esta descativada, solicita un codigo de activación",
				},
				410,
			);
		}
		next();
	},
};

export default linkChecker;
