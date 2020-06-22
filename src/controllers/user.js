'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');
const { userSchema } = require('../validations');
const { helpers } = require('../helpers');
let dateNow = helpers.formatDateToDB(new Date());
let creating_date = helpers.formatDateJSON(new Date());
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
      await userSchema.validateAsync(request.body);
      const {
        name,
        surname,
        date_birth,
        country,
        city,
        nickname,
        email,
        password,
        avatar
      } = request.body;

      ////// Foto avatar
      let savedFileName;
      if (request.files && request.files.avatar) {
        try {
          let uploadImageBody = request.files.avatar;
          savedFileName = await helpers.processAndSavePhoto(uploadImageBody);
        } catch (error) {
          throw helpers.errorGenerator(
            'Image have not been saved in database, try again,please',
            400
          );
        }
      }
      // Conexion a la base de datos para guardar datos obtenidos y validados del request.body
      connection = await getConnection();
      // SANITIZAR DATOS
      await connection.query(
        `INSERT INTO user (
          name,
          surname,
          date_birth,
          country,
          city,
          nickname,
          email,
          password,
          avatar,
          creation_date) VALUES(?,?,?,?,?,?,?,?,?,?);`,
        [
          name,
          surname,
          date_birth,
          country,
          city,
          nickname,
          email,
          password,
          savedFileName,
          dateNow
        ]
      );

      response.send({
        status: 200,
        // almaceno los datos en newUser por si los quiero manipular despues
        data: {
          name,
          surname,
          date_birth,
          country,
          city,
          nickname,
          email,
          avatar,
          creating_date
        },
        message: 'Your account was created succesfully.'
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  edit: async (request, response, next) => {},
  get: async (request, response, next) => {
    try {
      const { id } = request.params;
      connection = await getConnection();
      const [
        result
      ] = await connection.query(`SELECT * FROM user WHERE id = ?`, [id]);
      const [userResult] = result;
      if (!result) {
        throw helpers.errorGenerator(
          `The user with id ${id} does not exists`,
          404
        );
      }

      response.send({
        status: 200,
        data: userResult,
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
      const deletedUser = userToDelete;
      if (deletedUser.affectedRows === 0) {
        throw helpers.errorGenerator(`There is no user with id ${id} `, 404);
      }
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
