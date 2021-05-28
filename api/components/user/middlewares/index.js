import chalk from "chalk";
import logger from "../../../../utils/helpers/logger";
import model from "../../../../database/model";
import response from "../../../../routes/response";
import validationSchema from "./validations";

const TABLE = "users";

const middlewares = {
	validation: validationSchema,
	async checkIfEmailExists(req, res, next) {
		//
		const { email } = req.body;
		const emailExists = await model.findOne(TABLE, { email: email });

		//
		if (emailExists) {
			logger.error(
				chalk.red(
					"[ Middleware checkIfEmailExists ]: El email ya esta registrado",
				),
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

	async checkIfUserNotExists(req, res, next) {
		//
		const { email } = req.body;
		const { id } = req.params;

		const condition = () => {
			if (email === undefined) {
				return { id: id };
			} else {
				return { email: email };
			}
		};

		// check if user already exist
		const userExists = await model.findOne(TABLE, condition());

		if (!userExists) {
			logger.error(
				chalk.red(
					"[ Middleware checkIfUserNotExists ]: El usuario no existe",
				),
			);

			return response.error(
				req,
				res,
				{
					message: "El usuario no existe",
				},
				400,
			);
		}
		next();
	},

	async checkIfAccountIsActivated(req, res, next) {
		//
		const { email } = req.body;
		const { id } = req.params;

		const condition = () => {
			if (email === undefined) {
				return { id: id };
			} else {
				return { email: email };
			}
		};

		// check if code was already used
		const { is_account_active } = await model.findOne(TABLE, condition());

		if (is_account_active === 1) {
			logger.error(
				chalk.red(
					"[ Middleware checkIfAccountIsActivated ]: La cuenta ya esta activada",
				),
			);
			return response.error(
				req,
				res,
				{
					message: "La cuenta ya esta activada",
				},
				409,
			);
		}

		next();
	},
	async checkIfAccountIsDeactivated(req, res, next) {
		//
		const { email } = req.body;
		const { id } = req.params;

		const condition = () => {
			if (email === undefined) {
				return { id: id };
			} else {
				return { email: email };
			}
		};

		// check if code was already used
		const { is_account_active } = await model.findOne(TABLE, condition());

		if (is_account_active === 0) {
			logger.error(
				chalk.red(
					"[ Middleware checkIfAccountIsActivated ]: La cuenta ya esta desactivada",
				),
			);
			return response.error(
				req,
				res,
				{
					message: "La cuenta ya esta desactivada",
				},
				409,
			);
		}

		next();
	},

	async checkIfThereIsActivationCode(req, res, next) {
		//
		const { email } = req.body;
		const { id } = req.params;

		const condition = () => {
			if (email === undefined) {
				return { id: id };
			} else {
				return { email: email };
			}
		};

		// check if code was already used
		const { activation_code } = await model.findOne(TABLE, condition());

		if (activation_code !== null) {
			logger.error(
				chalk.red(
					"[ Middleware checkIfAccountIsActivated ]: Se ha enviado un link de confirmación, verifica tu correo para activar tu cuenta",
				),
			);
			return response.error(
				req,
				res,
				{
					message:
						"Se ha enviado un link de confirmación, verifica tu correo para activar tu cuenta",
				},
				409,
			);
		}

		next();
	},

	async checkIfActivationCodeAreTheSame(req, res, next) {
		//
		const { email } = req.body;
		const { id } = req.params;
		const { code } = req.query;

		const condition = () => {
			if (email === undefined) {
				return { id: id };
			} else {
				return { email: email };
			}
		};

		// check if code was already used
		const { activation_code } = await model.findOne(TABLE, condition());

		if (activation_code !== code) {
			logger.error(
				chalk.red(
					"[ Middleware checkIfAccountIsActivated ]: Los codigos de activación no coinciden , solicita un nuevo código",
				),
			);
			return response.error(
				req,
				res,
				{
					message:
						"Los codigos de activación no coinciden, solicita un nuevo código",
				},
				409,
			);
		}

		next();
	},
};

export default middlewares;
