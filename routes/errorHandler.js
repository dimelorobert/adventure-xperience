import logger from "../utils/helpers/logger";
import chalk from "chalk";

function previous(error, request, response, next) {
	logger.error(chalk.red("middleware", error.message && error.stack));

	response.status(error.httpCode || 500).send({
		message: error.message,
	});
}

function notFound(request, response) {
	logger.error(chalk.red("[404] => Pagina no encontrada"));
	response.status(404).send({
		status: 404,
		message: "Pagina no encontrada",
		comment: "¿Te has Perdido?",
	});
}

export default {
	previous,
	notFound,
};
