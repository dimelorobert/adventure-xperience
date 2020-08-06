'use strict';

// Modulos Requeridos
require('dotenv').config();
const {
  SECRET_KEY
} = process.env;
const {
  getConnection
} = require('../database');
const jwt = require('jsonwebtoken');
const {
  userSchema,
  loginSchema,
  newPasswordSchema
} = require('../validations');
const {
  helpers
} = require('../helpers');
const path = require('path');
const bcrypt = require('bcrypt');
const dateNow = helpers.formatDateToDB(new Date());
let creating_date = helpers.formatDateJSON(new Date());
let userImagePath = path.join(__dirname, `../${process.env.USER_UPLOADS_DIR}`);

let connection;

const userController = {
  signup: async (request, response, next) => {
    try {
      await userSchema.validateAsync(request.body);
      const {
        name,
        surname,
        date_birth,
        country,
        city,
        email,
        password,
        image,
        role
      } = request.body;
      connection = await getConnection();

      const passwordDB = await bcrypt.hash(password, 10);

      let savedFileName;
      if (request.files && request.files.image || request.body) {
        try {
          let uploadImageBody = request.files.image;
          savedFileName = await helpers.processAndSavePhoto(userImagePath, uploadImageBody, 300, 300);
        } catch (error) {
          return response.status(400).json({
            status: 'error',
            code: 400,
            error: 'La imagen no ha sido procesada correctamente ,por favor intentalo de nuevo'
          });
        }
      } else {
        
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
        INSERT INTO user(name, surname, date_birth, country, city, email, role, password, last_password_update, image, creation_date, ip)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [name, surname, date_birth, country, city, email, role, passwordDB, dateNow, /*savedFileName*/ image, dateNow, request.ip]);

      response.send({
        status: 200,
        data: {
          id: result.insertId,
          name,
          surname,
          date_birth,
          country,
          city,
          email,
          passwordDB,
          last_password_update: dateNow,
          image: image, //savedFileName,
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
      await connection.query(`UPDATE user SET name=?, surname=?, date_birth=?, country=?, city=?, email=?, password=?,last_password_update=? ,image=?, modify_date=?, ip=? WHERE id=?`, [name, surname, date_birth, country, city, email, passwordDB, dateNow, savedFileName, dateNow, request.ip, id]);

      response.send({
        status: 200,
        data: {
          id,
          name,
          surname,
          date_birth,
          country,
          city,
          email,
          passwordDB,
          last_password_update: dateNow,
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
      await loginSchema.validateAsync(request.body);
      const {
        email,
        password
      } = request.body;
      connection = await getConnection();
      const [userEmailDB] = await connection.query(`SELECT id, name, surname, date_birth, country, city, email, password, image, role, ip FROM user WHERE email=?`, [email]);

      if (!userEmailDB.length) {
        return response.status(401).json({
          status: 'error',
          code: 401,
          error: `El usuario con el email especificado no existe`
        });
      }
      const [user] = userEmailDB;
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return response.status(401).json({
          status: 'error',
          code: 401,
          error: `Contraseña incorrecta`
        });
      }
      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role
      };
      const token = jwt.sign({
        tokenPayload
      }, SECRET_KEY, {
        expiresIn: '30d'
      });
      return response.status(200).json({
        data: {
          user,
          token
        },
        message: `Bienvenido ${user.name} te has logeado con éxito`,
      })


    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },

  changePassword: async (request, response, next) => {
    try {
      connection = await getConnection();
      const {
        id
      } = request.params;

      // Body: oldPassword, newPassword, newPasswordRepeat (optional)
      await newPasswordSchema.validateAsync(request.body);

      const {
        oldPassword,
        newPassword,
      } = request.body;

      if (Number(id) !== request.auth.id) {
        throw generateError('No tienes permisos para cambiar el password del usuario', 401);
      }

      if (newPassword !== newPasswordRepeat) {
        throw generateError('El campo nueva password y nueva password repetir deben de ser identicos', 400);
      }

      if (oldPassword === newPassword) {
        throw generateError('La password actual y la nueva password no pueden ser iguales', 401);
      }

      const [currentUser] = await connection.query(
        `
      SELECT id, password FROM user WHERE id=?
    `,
        [id]
      );

      if (!currentUser.length) {
        throw generateError(`El usuario con id: ${id} no existe`, 404);
      }

      const [dbUser] = currentUser;

      // Comprobar la vieja password

      const passwordsMath = await bcrypt.compare(oldPassword, dbUser.password);

      if (!passwordsMath) {
        throw generateError('La password actual es incorrecta', 401);
      }

      // hash nueva password

      const dbNewPassword = await bcrypt.hash(newPassword, 10);

      await connection.query(
        `
      update users set password=? where id=?
    `,
        [dbNewPassword, id]
      );

      response.send({
        status: 'ok',
        message: 'Password actualizado correctamente, vuelve a hacer login'
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }


}

module.exports = {
  userController
};