'use strict';

// Configuracion puertos server
import 'dotenv/config.js';

module.exports = (app) => {
  const { DEFAULT_PORT } = process.env;

  const portAssigned = DEFAULT_PORT || 3002;

  app.set('port', portAssigned);
};
