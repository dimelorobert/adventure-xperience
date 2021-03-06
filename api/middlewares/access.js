import { verify } from "jsonwebtoken";
import config from "../config";
import userModel from "../components/users/userModel";
import logger from "../../utils/helpers/logger";

export default {
	only_users: (request, response, next) => {
		const { authorization } = request.headers;

		// we check if reequest has an authorization in headers
		if (!authorization) {
			return response.status(401).send({
				message: "Debes estar registrado para tener acceso a esta sección",
			});
		}

		// we check if user token is admin or not
		try {
			const { is_admin } = verify(authorization, config.jwt.secret_key);

			if (is_admin === 0 || is_admin === 1)
				// else user get access
				next();
		} catch (error) {
			response.status(401).send({
				message: "La sesión ha expirado, vuelve a iniciar sesión",
			});
		}
	},
	only_admins: (request, response, next) => {
		const { authorization } = request.headers;

		// we check if reequest has an authorization in headers
		if (!authorization) {
			return response.status(401).send({
				message: "Debes estar registrado para tener acceso a esta sección",
			});
		}

		// we check if user token is admin or not
		try {
			const { is_admin } = verify(authorization, config.jwt.secret_key);

			if (is_admin !== 1) {
				return response.status(403).send({
					message: "No tienes permisos de administrador",
				});
			} else {
				next();
			}
		} catch (error) {
			response.status(401).send({
				message: "La sesión ha expirado, vuelve a iniciar sesión",
			});
		}
	},
	emailChecker: async (request, response, next) => {
		const { email } = request.body;
		// check if email already exist
		const emailExist = await userModel.findOne({ email: email }, "users");

		if (!emailExist) {
			return next();
		} else {
			logger.error("El email ya esta registrado");
			return response.status(409).send({
				message: "El email ya esta registrado",
			});
		}
	},
};
