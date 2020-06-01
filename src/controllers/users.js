'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');
const { usersSchema } = require('../models');
const { formatDateToDB, errorGenerator } = require('../helpers');
let connection;

const usersController = {
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
    try {
      await adventuresSchema.validateAsync(request.body);

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
      const newAdventure = {
        name,
        description,
        image,
        price,
        country,
        city,
        vacancy,
        date_selected
      };
      console.log(newAdventure);
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
      connection = await getConnection();

      await connection.query(
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
        message: 'Adventure added succesfully.'
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

module.exports = { usersController };
