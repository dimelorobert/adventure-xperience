'use strict';

// Modulos Requeridos
require('dotenv').config();
const {
  SECRET_KEY
} = process.env;
const {
  getConnection
} = require('../database');
const {
  userSchema
} = require('../validations');
const {
  loginSchema
} = require('../validations');
const {
  helpers
} = require('../helpers');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  date
} = require('@hapi/joi');
const {
  getToken
} = require('../services/token.js');
const dateNow = helpers.formatDateToDB(new Date());
let creating_date = helpers.formatDateJSON(new Date());
let userImagePath = path.join(__dirname, `../${process.env.USER_UPLOADS_DIR}`);

let connection;

const userController = {
  new: async (request, response, next) => {
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
        image,
        role
      } = request.body;
      connection = await getConnection();

      const passwordDB = await bcrypt.hash(password, 10);

      let savedFileName;
      if (request.files && request.files.image) {
        try {
          let uploadImageBody = request.files.image;
          savedFileName = await helpers.processAndSavePhoto(userImagePath, uploadImageBody);
        } catch (error) {
          return response.status(400).json({
            status: 'error',
            code: 400,
            error: 'La imagen no ha sido procesada correctamente ,por favor intentalo de nuevo'
          });
        }
      }

      const [existingEmail] = await connection.query(`SELECT id FROM user WHERE email=?`, [email]);
      if (existingEmail.length) {
        return response.status(409).json({
          status: 'error',
          code: 409,
          error: `El email ${email} que has introducido ya esta registrado`
        });
      }

      //let roleUser = 'admin';
      const [result] = await connection.query(`
        INSERT INTO user(name, surname, date_birth, country, city, nickname, email, role, password, image, creation_date, ip) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [name, surname, date_birth, country, city, nickname, email, role, passwordDB, savedFileName, dateNow, request.ip]);

      response.send({
        status: 200,
        data: {
          id: result.insertId,
          name,
          surname,
          date_birth,
          country,
          city,
          nickname,
          email,
          passwordDB,
          image: savedFileName,
          role,
          creation_date: creating_date,
          ip: request.ip
        },
        message: `El usuario con el id ${result.insertId} fue creado con exito`
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
      const {
        id
      } = request.params;
      connection = await getConnection();
      const [result] = await connection.query(`SELECT * FROM user WHERE id = ?`, [id]);
      if (!result.length) {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `El usuario con el id ${id} no existe,por favor intentalo de nuevo`
        });
      } else {
        const [userResult] = result;
        response.send({
          status: 200,
          data: userResult,
          message: `La busqueda del usuario con el id ${userResult.id} fue realizada con exito`
        });
      }
    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  list: async (request, response, next) => {
    try {
      connection = await getConnection();
      const [result] = await connection.query(`SELECT * FROM user;`);
      if (!result.length) {
        return response.status(404).json({
          status: 'error',
          code: 400,
          error: `No hay usuarios para mostrar aún`
        });
      } else {
        response.send({
          status: 200,
          data: result,
          message: 'Lista de todos los usuarios creados'
        });
      }
    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  update: async (request, response, next) => {
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
        image
      } = request.body;
      const {
        id
      } = request.params;

      connection = await getConnection();
      const passwordDB = await bcrypt.hash(password, 10);
      const [current] = await connection.query('SELECT image FROM user WHERE id=?', [id]);

      if (!current.length) {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `El usuario con el id ${id} no existe`
        });

      };
      if (current[0].image) {
        await helpers.deletePhoto(userImagePath, current[0].image);
      };

      let savedFileName;

      if (request.files && request.files.image) {
        try {
          savedFileName = await helpers.processAndSavePhoto(userImagePath, request.files.image);
        } catch (error) {
          return response.status(400).json({
            status: 'error',
            code: 400,
            error: 'La imagen no ha sido procesada correctamente ,por favor intentalo de nuevo'
          });
        }
      } else {
        savedFileName = current.image;
      }
      await connection.query(`UPDATE user SET name=?, surname=?, date_birth=?, country=?, city=?, nickname=?, email=?, password=?, image=?, modify_date=?, ip=? WHERE id=?`, [name, surname, date_birth, country, city, nickname, email, passwordDB, savedFileName, dateNow, request.ip, id]);

      response.send({
        status: 200,
        data: {
          id,
          name,
          surname,
          date_birth,
          country,
          city,
          nickname,
          email,
          passwordDB,
          image: savedFileName,
          modify_date: creating_date,
          ip: request.ip
        },
        message: `El usuario con el id ${id} fue modificada satisfactoriamente`
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
      const {
        id
      } = request.params;
      connection = await getConnection();

      const [result] = await connection.query('SELECT image FROM user WHERE id=?', [id]);


      if (!result.length) {
        return response.status(404).json({
          status: 'error',
          error: `El usuario con el id ${id} no existe`
        });
      };

      if (result && result[0].image) {
        await helpers.deletePhoto(userImagePath, result[0].image);
      } else {
        await helpers.deletePhoto(userImagePath, result[0].image);
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `La foto del usuario con el id ${id} no se pudo procesar correctamente`
        });
      }

      await connection.query(`DELETE FROM user WHERE id=?`, [id]);
      response.send({
        status: 200,
        message: `El usuario con el id ${id} ha sido borrado con éxito `
      });

    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  login: async (request, response, next) => {
    try {
      const {
        email,
        password
      } = request.body;
      connection = await getConnection();
      const [userEmailDB] = await connection.query(`SELECT id, name, surname, date_birth, country, city, email, password, image, role, ip FROM user WHERE email=?`, [email]);

      if (userEmailDB[0]) {
        const passwordMatch = await bcrypt.compare(password, userEmailDB[0].password);

        if (passwordMatch) {
          let tokenReturn = await getToken.encode(userEmailDB[0].id);
          console.log(tokenReturn);
          return response.status(200).json({
            userEmailDB,
            tokenReturn,
            message: `Bienvenido ${userEmailDB[0].name} te has logeado con éxito`,
          })
        } else {
          return response.status(401).json({
            status: 'error',
            code: 401,
            error: `Contraseña incorrecta`
          });
        }
      } else {
        return response.status(404).json({
          status: 'error',
          code: 404,
          error: `El usuario con el email especificado no existe`
        });
      }
    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },

};

module.exports = {
  userController
};