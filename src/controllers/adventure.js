'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');
const adventureSchema = require('../models');
const { formatDateToDB, errorGenerator } = require('../helpers');
let connection;

const adventureController = {
  list: async (request, response, next) => {
    try {
      connection = await getConnection();
      const [adventures] = await connection.query(`SELECT * FROM adventures;`);
      response.send({
        status: 200,
        data: adventures
      });
    } catch (error) {
      next(error);
    }
  },
  create: async (request, response, next) => {
    const { user_id } = request.auth;
    try {
      if (
        !name ||
        !description ||
        !image ||
        !price ||
        !country ||
        !city ||
        !vacancy ||
        !date_selected
      ) {
        errorGenerator('Please fill all the fields required', 404);
      }
      await adventureSchema.validateAsync(request.body);
      connection = await getConnection();
      const {
        name,
        description,
        image,
        price,
        country,
        city,
        vacancy,
        date_selected
      } = request.body;
      const [
        adventure
      ] = await connection.query(
        'INSERT INTO adventures(name, description, image, price, country, city, vacancy, date_selected,user_id,category_id) VALUES(?,?,?,?,?,?,?,?);',
        [
          name,
          description,
          image,
          price,
          country,
          city,
          vacancy,
          formatDateToDB(new Date())
        ]
      );

      console.log(adventure);

      response.send({
        status: 200,

        data: {
          name,
          description,
          image,
          price,
          country,
          city,
          vacancy,
          date_selected
        },
        message: 'Adventure added succesfully.',
        adventure_id: adventure.insertId
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
