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
  signup: async (request, resolve, next) => {
    try {
      console.log(request.body);
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
        avatar,
        
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
        `INSERT INTO user(
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

      resolve.send({
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
  edit: async (request, response, next) => {
    try {
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
        isAdmin,
        isPremium,
        isEnable,
        modify_date_account,
        ip
      } = request.body;
      const { id } = request.params;
      await userSchema.validateAsync(request.body);
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
        !isAdmin ||
        !isPremium ||
        !isEnable ||
        !modify_date_account ||
        !ip
      ) {
        helpers.errorGenerator('Please fill all the fields required', 400);
      }
      connection = await getConnection();
      const current = await connection.query(
        `SELECT name,
          surname,
          date_birth,
          address,
          country,
          city,
          nickname,
          email,
          password,
          avatar,
          isPremium,
          isEnable,
          modify_date_account,
          ip FROM user WHERE id=:id`,
        [id]
      );
    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  get: async (request, resolve, next) => {
    try {
      const { id } = request.params;
      connection = await getConnection();
      const [
        getUser
      ] = await connection.query(`SELECT * FROM user WHERE id = ?`, [id]);
      const [userGetById] = getUser;
      if (!userGetById) {
        throw helpers.errorGenerator(
          `The user with id ${id} does not exists`,
          404
        );
      }

      resolve.send({
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
  delete: async (request, resolve, next) => {
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
      resolve.send({
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
