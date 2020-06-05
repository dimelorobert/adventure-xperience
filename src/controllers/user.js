'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');
const { userSchema } = require('../models');
const { formatDateToDB, errorGenerator } = require('../helpers');
let dateNow = formatDateToDB(new Date());
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
  signup: async (request, response, next) => {
    try {
      console.log(request.body);
      // await userSchema.validateAsync(request.body);
      const {
        name,
        surname,
        date_birth,
        country,
        city,
        nickname,
        email,
        password,
        avatar,
        isAdmin,
        updating_date,
        ip
      } = request.body;
      if (
        !name ||
        !surname ||
        !date_birth ||
        !country ||
        !city ||
        !nickname ||
        !email ||
        !password ||
        !avatar ||
        !isAdmin
      ) {
        errorGenerator('Please fill all the fields required', 400);
      }
      // Conexion a la base de datos para guardar datos obtenidos y validados del request.body
      connection = await getConnection();
      // SANITIZAR DATOS
      const newUser = await connection.query(
        'INSERT INTO user(name, surname, date_birth, country, city, nickname, email, password, avatar, isAdmin, creating_date, updating_date, ip) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);',
        [
          name,
          surname,
          date_birth,
          country,
          city,
          nickname,
          email,
          password,
          avatar,
          isAdmin,
          dateNow,
          updating_date,
          ip
        ]
      );

      response.send({
        status: 200,
        // almaceno los datos en newUser por si los quiero manipular despues
        data: newUser,
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
  get: async (request, response, next) => {
    try {
      const { id } = request.params;
      connection = await getConnection();
      const [
        getUser
      ] = await connection.query(`SELECT * FROM user WHERE id = ?`, [id]);
      const [userGetById] = getUser;
      if (!userGetById) {
        throw errorGenerator(`The user with id ${id} does not exists`, 404);
      }

      response.send({
        status: 200,
        data: getUser,
        message: 'Your user searching was succesfully.'
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
    try {
      const { id } = request.params;
      connection = await getConnection();
      const [
        userToDelete
      ] = await connection.query(` DELETE FROM user WHERE id=?`, [id]);
      console.log(userToDelete);

      response.send({
        status: 200,
        data: userToDelete,
        message: `User with  id ${id} has been deleted.`
      });
    } catch (error) {
      console.log(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
};

module.exports = { userController };
