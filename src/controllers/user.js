'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');
const { userSchema } = require('../models');
const { formatDateToDB, errorGenerator } = require('../helpers');
let connection;

const userController = {
  list: async (request, response, next) => {
    try {
      connection = await getConnection();
      const [users] = await connection.query(`SELECT * FROM user;`);
      response.send({
        status: 200,
        data: users
      });
    } catch (error) {
      next(error);
    }
  },
  create: async (request, response, next) => {
    try {
      console.log(request.body);
      // await userSchema.validateAsync(request.body);
      const {
        name,
        surname,
        date_birth,
        address,
        country,
        city,
        nickname,
        email,
        password,
        avatar,
        role,
        updating_date,
        ip
      } = request.body;
      if (
        !name ||
        !surname ||
        !date_birth ||
        !address ||
        !country ||
        !city ||
        !nickname ||
        !email ||
        !password ||
        !avatar ||
        !role ||
        !updating_date ||
        ip
      ) {
        errorGenerator('Please fill all the fields required', 400);
      }
      connection = await getConnection();
      // SANITIZAR DATOS
      await connection.query(
        'INSERT INTO user(name, surname, date_birth, address, country, city, nickname, email, password, avatar, role, creating_date, updating_date, ip) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
        [
          name,
          surname,
          date_birth,
          address,
          country,
          city,
          nickname,
          email,
          password,
          avatar,
          role,
          formatDateToDB(new Date()),
          updating_date,
          ip
        ]
      );

      response.send({
        status: 200,
        data: {
          name,
          surname,
          date_birth,
          address,
          country,
          city,
          nickname,
          email,
          password,
          avatar,
          role,
          updating_date,
          ip
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

module.exports = { userController };
