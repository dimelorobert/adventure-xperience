'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');
const { formatDateToDB } = require('../helpers/');
let connection;

const adventureController = {
  lista: async function adventureList(request, response, next) {
    try {
      connection = await getConnection();
      const adventures = await connection.query(
        `SELECT id, name, image, price FROM adventure;`
      );

      response.send({
        status: 'ok',
        data: adventures
      });
    } catch (error) {
      return error;
    }
  },
  crea: async function newAdventure(request, response, next) {
    try {
      console.log(request.body);
      const { name, description, image, price, city, vacancy } = request.body;
      if (!name || !description || !price || !city || !vacancy) {
        const error = new Error('campo requerido');
        error.httpCode = 400;
        throw error;
      }
      connection = await getConnection();
      const result = await connection.query(
        `INSERT INTO adventure(name, description, image, price, city, vacancy,date_select) 
      VALUES(:name, :description, :image, :price, :city, :vacancy,:date_select)`,
        {
          ':name': name,
          ':description': description,
          ':image': image,
          ':price': price,
          ':city': city,
          ':vacancy': vacancy,
          ':date_select': formatDateToDB(new Date())
        }
      );
      console.log(result);
      response.send({
        status: 'ok',
        data: { name, description, image, price, city, vacancy }
      });
    } catch (error) {
      next(error);
    }
  },
  borra: async function deleteAdventure(request, response, next) {
    response.send('Borra la aventura');
  }
};

module.exports = { adventureController };
