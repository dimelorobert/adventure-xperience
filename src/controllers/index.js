'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');

async function adventureList(request, response, next) {
  let connection;

  connection = await getConnection();
  const adventures = await connection.query(`SELECT * FROM adventure;`);
  response.send({
    status: 'ok',
    data: adventures
  });
}

async function newAdventure(request, response, next) {
  response.send('Crea y guarda una nueva aventura');
}

async function deleteAdventure(request, response, next) {
  response.send('Borra la aventura');
}

module.exports = { adventureList, newAdventure, deleteAdventure };
