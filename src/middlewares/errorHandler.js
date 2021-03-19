import logger from "../helpers/logger";
const { ADMIN_EMAIL } = process.env;

export default {
	previous: (error, request, response, next) => {
		response.status(response.httpCode || 500).send({
			message:
				error.message ||
				`Ha ocurrido un error en el servidor , por favor contacte con el administrador: ${ADMIN_EMAIL}`,
		});
		logger.error(` [ ${error.message || error} ]`);
	},
	not_found: (request, response) => {
		// message json for client
		response.status(404).send({
			errorCode: 404,
			message: "Pagina no encontrada",
			comment: "¿Te has perdido?",
		});
		logger.error(` [ ${error.message || error} ]`);
	},
};
