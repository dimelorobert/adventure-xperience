'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');
const adventureSchema = require('../models');
const { formatDateToDB, errorGenerator } = require('../helpers');
const dateNow = formatDateToDB(new Date());
let connection;

const adventureController = {
  list: async (request, response, next) => {
    try {
      connection = await getConnection();
      const [adventures] = await connection.query(`SELECT * FROM adventure;`);
      response.status(200).json(adventures);
    } catch (error) {
      next(error);
    }
  },
  new: async (request, response, next) => {
    try {
      const {
        name,
        description,
        image,
        price,
        country,
        city,
        vacancy,
        available,
        user_id
      } = request.body;

      if (
        !name ||
        !description ||
        !image ||
        !price ||
        !country ||
        !city ||
        !vacancy ||
        !available ||
        !user_id
      ) {
        errorGenerator('Please fill all the fields required', 404);
      }

      connection = await getConnection();

      const [
        adventure
      ] = await connection.query(
        'INSERT INTO adventure (name, description, image, price, country, city, vacancy, available, date_selected) VALUES(?,?,?,?,?,?,?,?,?);',
        [
          name,
          description,
          image,
          price,
          country,
          city,
          vacancy,
          available,
          dateNow,
          user_id
        ]
      );
      console.log(adventure);
      response.send({
        status: 200,
        data: {
          id: adventure.lastID,
          name,
          description,
          image,
          price,
          country,
          city,
          vacancy,
          available,
          creation_date: dateNow,
          user_id
        }
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  delete: async (request, response, next) => {
    response.send('Borra la aventura');
  }
};

module.exports = { adventureController };
