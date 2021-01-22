function notFoundErrorHandler(request, response) {
  response.status(404).send({
    status: 'error',
    code: 404,
    message: '❌ Ooops...Page not found, try again my friend!😢'
  });
}

function previousErrorHandler(error, request, response, next) {
  console.log('Error from midleware :::', error);

  response.status(error.httpCode || 500).send({
    message: error.message
  });
}

export { notFoundErrorHandler, previousErrorHandler };
