const { ADMIN_EMAIL } = process.env;

export function previousErrorHandler(error, request, response, next) {
	response.status(response.httpCode || 500).send({
		message:
			error.message ||
			`Ha ocurrido un error en el servidor , por favor contacte con el administrador: ${ADMIN_EMAIL}`,
	});
}

export function notFoundErrorHandler(request, response) {
	// message json for client
	response.status(404).send({
		errorCode: 404,
		message: "Pagina no encontrada",
		comment: "¿Te has perdido?",
	});
}
