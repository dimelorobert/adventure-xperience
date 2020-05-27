'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');
let connection;

const adventureController = {
  lista: async function adventureList(request, response, next) {
    try {
      connection = await getConnection();
      const adventures = await connection.query(`SELECT * FROM category;`);

      response.send({
        status: 'ok',
        data: adventures
      });
    } catch (error) {
      next(error);
    }
  },
  crea: async function newAdventure(request, response, next) {
    response.send('Crea aventura');
  },
  borra: async function deleteAdventure(request, response, next) {
    response.send('Borra la aventura');
  }
};

module.exports = { adventureController };
