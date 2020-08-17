'use strict';

// Modulos Requeridos
require('dotenv').config();
const {
  SECRET_KEY,
  PUBLIC_HOST,
  USERS_UPLOADS_DIR,
  USERS_VIEW_UPLOADS,
  SERVICE_EMAIL,
  ADMIN_EMAIL,
  PASSWORD_ADMIN_EMAIL
} = process.env;

const {
  getConnection
} = require('../database');

const jwt = require('jsonwebtoken');

const {
  usersSchema,
  loginSchema,
  newPasswordSchema
} = require('../validations');

const {
  helpers
} = require('../helpers');

const uuid = require('uuid');

const path = require('path');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const dateNow = helpers.formatDateToDB(new Date());
const creating_date = helpers.formatDateJSON(new Date());


let connection;

const usersController = {
  create: async (request, response, next) => {
    try {

      // we validate data body received 
      await usersSchema.validateAsync(request.body);
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

      // we open connection to db
      connection = await getConnection();

      // we check if the email exist into db
      const [existingEmail] = await connection.query(`SELECT id FROM users WHERE email=?`, [email]);

      if (existingEmail.length) {
        return response.status(409).json({
          status: 'error',
          code: 409,
          error: `El email ${email} que has introducido ya esta registrado`
        });
      }

      // we hash the password to save into db
      const passwordDB = await bcrypt.hash(password, 10);

      // code to activate account
      const regCode = helpers.randomString(20);

      // name userfolder
      const emailUuid = uuid.v4(email);

      // path where it is save the userdata
      const userImagePath = path.join(__dirname, `../${USERS_UPLOADS_DIR}`, `${emailUuid}`);

      // we process image file that we receive into the body
      let savedFileName;
      if (request.files && request.files.image) {

        try {
          let uploadImageBody = request.files.image;
          // we define location path and image size values
          savedFileName = await helpers.processAndSavePhoto(userImagePath, uploadImageBody, 300, 300);
        } catch (error) {
          return response.status(400).json({
            status: 'error',
            code: 400,
            error: 'La imagen no ha sido procesada correctamente ,por favor intentalo de nuevo'
          });
        }

      } else {
        savedFileName = image;
      }
      // we generate the image link with the path to save into db and to show in front
      let image4Vue = path.join(`${PUBLIC_HOST}`, `./${USERS_VIEW_UPLOADS}`, `./${emailUuid}`, `./${savedFileName}`);
      // let folderUserDataDB = path.join(`${__dirname}`, `./${USERS_VIEW_UPLOADS}`, `./${emailUuid}`);
      let role;

      if (name === 'Robert' && surname === 'Hernández' && email === 'airbusjayrobert@gmail.com' && date_birth === '1990-04-06') {
        role = 'admin'
      } else {
        role = 'user'
      }

      // we save all data into db
      const [newUserData] = await connection.query(`
        INSERT INTO users(name, surname, date_birth, country, city, email, role, password, last_password_update, image, user_folder, creation_date, ip, reg_Code)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [name, surname, date_birth, country, city, email, role, passwordDB, dateNow, savedFileName, userImagePath, dateNow, request.ip, regCode]);

      // encrypt id
      // const idUuid = uuid.v4(newUserData.insertId);

      // we send an email with the activation link for user account 
      const userValidationLink = `${PUBLIC_HOST}/users/${newUserData.insertId}/activate?code=${regCode}`

      if (!existingEmail.length.error) {
        try {
          const transporter = nodemailer.createTransport({
            service: SERVICE_EMAIL,
            auth: {
              user: ADMIN_EMAIL,
              pass: PASSWORD_ADMIN_EMAIL
            }
          });
          const mailOptions = {
            from: ADMIN_EMAIL,
            to: `${email}`,
            subject: `Activa tu cuenta en Aventura Xperience`,
            text: `Para validar la cuenta pega esta URL en tu navegador : ${userValidationLink}`,
            html: `
            <div>
              <h1> Activa tu cuenta en Aventura Xperience </h1>
              <p> Para validar la cuenta pega esta URL en tu navegador: ${userValidationLink} o pulsa click en el siguiente enlace:
              <a href="${userValidationLink}" target="_blank">Activa tu cuenta dando click aquí!</a>
              </p>
            </div>`
          };

          transporter.sendMail(mailOptions, (error, info) => {
            console.log("Email enviado");
            response.status(200).json(request.body);

          });

        } catch (error) {
          console.log(error);
          if (error) {
            response.status(500).send(error.message);
          }
        }

      } else {
        return response.status(500).json({
          status: 'error',
          code: 500,
          error: `No se pudo enviar el email debido a un error en el servidor`
        });
      }

      // if everything ok, we send all data to json format
      response.send({
        status: 200,
        data: {
          id: newUserData.insertId,
          name,
          surname,
          date_birth,
          country,
          city,
          email,
          password: passwordDB,
          last_password_update: dateNow,
          image: image4Vue,
          user_folder: userImagePath,
          role,
          creation_date: creating_date,
          ip: request.ip,
          regCode
        },
        message: `La cuenta fue creada con éxito, verifica tu buzón de correo email para activar tu cuenta.`
      });
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
      // we open connection to db
      connection = await getConnection();

      // we build a SQL query to list all users
      const [result] = await connection.query(`
        SELECT id, name, surname, date_birth, 
        country, city, email, image, role, creation_date
        FROM users;`);

      if (!result.length) {
        return response.status(404).json({
          status: 'error',
          code: 400,
          error: `No existen usuarios aún`
        });
      }
      response.send({
        status: 200,
        data: result,
        message: 'Lista de todos los usuarios creados'
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

      // we receive params to get th search
      const {
        id
      } = request.params;

      // we open connection to db
      connection = await getConnection();

      // we build a SQL the query to look for user 
      const [result] = await connection.query(`
        SELECT * 
        FROM users 
        WHERE id = ?`,
        [id]);

      if (!result.length) {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `El usuario con el id ${id} no existe,por favor intentalo de nuevo`
        });
      }
      const [userResult] = result;
      response.send({
        status: 200,
        data: userResult,
        message: `La busqueda del usuario con el id ${userResult.id} fue realizada con exito`
      });

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
      connection = await getConnection();

      await usersSchema.validateAsync(request.body);
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


      const passwordDB = await bcrypt.hash(password, 10);
      const [current] = await connection.query(`
        SELECT image 
        FROM users 
        WHERE id=?`,
        [id]);

      // name userfolder
      const emailUuid = uuid.v4(email);
      // path where it is save the userdata
      const userImagePath = path.join(__dirname, `../${USERS_UPLOADS_DIR}`, `${emailUuid}`);

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
      await connection.query(`
        UPDATE users 
        SET name=?, surname=?, date_birth=?, country=?, city=?, email=?, password=?,last_password_update=? ,image=?, modify_date=?, ip=? 
        WHERE id=?`,
        [name, surname, date_birth, country, city, email, passwordDB, dateNow, savedFileName, dateNow, request.ip, id]);

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

      const [result] = await connection.query(`
        SELECT image, user_folder
        FROM users  
        WHERE id=?`,
        [id]);


      if (!result.length) {
        return response.status(404).json({
          status: 'error',
          error: `El usuario con el id ${id} no existe`
        });
      };

      const [destructuringImageUserFolder] = result;
      const {
        image,
        user_folder
      } = destructuringImageUserFolder;

      if (result && image) {
        await helpers.deletePhoto(user_folder, image);
        await helpers.deleteFolder(user_folder);
      } else {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `La foto del usuario con el id ${id} no se pudo procesar correctamente`
        });
      }

      await connection.query(`DELETE FROM users WHERE id=?`, [id]);
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

  activate: async (request, response, next) => {
    try {

      // we open connection to db and get user id and code activation
      connection = await getConnection();
      const {
        id
      } = request.params;
      const {
        code
      } = request.query;

      // we build a SQL query to update and to activate the user account
      const [result] = await connection.query(`
        UPDATE users
        SET isActive=1, reg_code=NULL
        WHERE id=?
        AND reg_code=? `,
        [id, code]);

      if (result.affectedRows === 0) {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `No se pudo activar tu cuenta, vuelve a solicitar un nuevo link para activar tu cuenta`
        });
      }

      // if you need to use the token uncomment the following lines
      // we select user role from id
      /*const [user] = await connection.query(`
        SELECT role 
        FROM users 
        WHERE id=?`, 
        [id]);

      // we build the JSONWEBTOKEN
      const tokenPayload = {
        id: id,
        role: user[0].role
      };
      const token = jwt.sign({
        tokenPayload
      }, SECRET_KEY, {
        expiresIn: '30d'
      });*/

      return response.status(200).json({
        /*data: {
          token
        },*/
        message: `La cuenta ha sido actidava con éxito, ya puedes iniciar sesión`,
      });

    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  sendCode: async (request, response, next) => {
    try {

      const {
        id
      } = request.params;

      // we open connection to db
      connection = await getConnection();

      // we verify if user account is active
      const [isActivate] = await connection.query(`
        SELECT isActive, email
        FROM users 
        WHERE id=?`,
        [id]);
      console.log(isActivate);

      const [destructuringIsActiveAndEmail] = isActivate;

      const {
        isActive,
        email
      } = destructuringIsActiveAndEmail;



      if (isActive === 1) {

        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `La cuenta con el email ${email} ya esta activada`
        });

      } else {
        // code to activate account
        const newCode = helpers.randomString(20);

        // we set reg_code into db
        const [result] = await connection.query(`
        UPDATE users
        SET reg_code=?
        WHERE id=?`,
          [newCode, id]);
        console.log(result);

        if (!result.affectedRows === 0) {
          return response.status(400).json({
            status: 'error',
            code: 400,
            error: `No se pudo generar un nuevo codigo de activación ,la cuenta ya esta activada o hubo un error en el servidor, ponte en contacto con el admin : airbusjayrobert@gmail.com`
          });

        }

        // we send an email with the activation link for user account 
        const userValidationLink = `${PUBLIC_HOST}/users/${id}/activate?code=${newCode}`;

        try {
          const transporter = nodemailer.createTransport({
            service: SERVICE_EMAIL,
            auth: {
              user: ADMIN_EMAIL,
              pass: PASSWORD_ADMIN_EMAIL
            }
          });
          const mailOptions = {
            from: ADMIN_EMAIL,
            to: `${email}`,
            subject: `Activa tu cuenta en Aventura Xperience`,
            text: `Para validar la cuenta pega esta URL en tu navegador : ${userValidationLink}`,
            html: `
            <div>
              <h1> Nuevo codigo de activación cuenta en Aventura Xperience </h1>
              <p> Para validar la cuenta pega esta URL en tu navegador: ${userValidationLink} o pulsa click en el siguiente enlace:
              <a href="${userValidationLink}" target="_blank">Activa tu cuenta dando click aquí!</a>
              </p>
            </div>`
          };

          transporter.sendMail(mailOptions, (error, info) => {
            response.status(200).json(request.body);

          });

        } catch (error) {
          console.log(error);
          if (error) {
            response.status(500).send(error.message);
          }
        }
      }

      // if everything ok, we send all data to json format
      response.send({
        status: 200,
        message: `Se ha enviado un nuevo codigo verifica tu buzón de correo email para activar tu cuenta.`
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  recoveryPassword: async (request, response, next) => {
    try {

      const {
        email
      } = request.body;

      // we open connection to db
      connection = await getConnection();

      // we check if the email exist into db
      const [existingUser] = await connection.query(`
        SELECT id 
        FROM users 
        WHERE email=?`,
        [email]);

      if (!existingUser.length) {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `El email ${email} No esta asociado a ningun usuario, verificalo o crea una nueva cuenta`
        });
      }
      console.log(existingUser);

      // new password encrypted
      const passwordDB = await bcrypt.hash(email, 10);

      // we set reg_code into db
      const [result] = await connection.query(`
        UPDATE users 
        SET password=?,
        last_password_update=?
        WHERE email=?
        `,
        [passwordDB, dateNow, email]);
      console.log(result);

      if (!result.affectedRows === 0) {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `No se pudo generar una nueva password, ponte en contacto con el admin : airbusjayrobert@gmail.com`
        });

      }

      // we send an email with the activation link for user account 
      const userDefaultPasswordLink = `${PUBLIC_HOST}/users/`;

      try {
        const transporter = nodemailer.createTransport({
          service: SERVICE_EMAIL,
          auth: {
            user: ADMIN_EMAIL,
            pass: PASSWORD_ADMIN_EMAIL
          }
        });
        const mailOptions = {
          from: ADMIN_EMAIL,
          to: `${email}`,
          subject: `Restablecer password cuenta Aventura Xperience`,
          text: `Para restablecer la password pega esta URL en tu navegador : ${userDefaultPasswordLink}`,
          html: `
            <div>
              <h1>Restablecer password cuenta Aventura Xperience</h1>
              <p>Para validar la cuenta pega esta URL en tu navegador: ${userDefaultPasswordLink} o pulsa click en el siguiente enlace:
              <a href="${userDefaultPasswordLink}" target="_blank">Restablecer password dando click aquí!</a>
              </p>
            </div>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          response.status(200).json(request.body);

        });

      } catch (error) {
        console.log(error);
        if (error) {
          response.status(500).send(error.message);
        }
      }

      // if everything ok, we send all data to json format
      response.send({
        status: 200,
        message: `Se ha enviado una nueva password a tu email para iniciar sesión.`
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
      const [userEmailDB] = await connection.query(`
        SELECT id, name, surname, email, password, role, ip 
        FROM users 
        WHERE email=? 
        AND isActive=1`,
        [email]);

      if (!userEmailDB.length) {
        return response.status(401).json({
          status: 'error',
          code: 401,
          error: `La cuenta con el email especificado no existe o no esta activado, activa tu cuenta`
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
          tokenPayload,
          token
        },
        message: `Bienvenid@ ${user.name} ${user.surname} te has logeado con éxito`,
      });


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

      // Body: oldPassword, newPassword, 
      await newPasswordSchema.validateAsync(request.body);

      const {
        oldPassword,
        newPassword,
        newPasswordRepeat
      } = request.body;

      const {
        tokenPayload
      } = request.authorization;
      console.log(tokenPayload);

      if (Number(id) !== tokenPayload.id) {
        return response.status(401).json({
          status: 'error',
          code: 401,
          error: `No tienes permisos para cambiar la password de usuario`
        });
      }

      if (newPassword !== newPasswordRepeat) {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: 'La nueva contraseña no coincide con su repetición'
        });
      }

      if (oldPassword === newPassword) {
        return response.status(401).json({
          status: 'error',
          code: 401,
          error: 'La contraseña nueva no puede ser la misma que la antigua'
        });

      }

      const [currentUser] = await connection.query(
        `
      SELECT id, password FROM users WHERE id=?
    `,
        [id]
      );

      if (!currentUser.length) {
        return response.status(404).json({
          status: 'error',
          code: 404,
          error: `El usuario con id: ${id} no existe`
        });

      }

      const [dbUser] = currentUser;

      // Comprobar la vieja password

      const passwordsMath = await bcrypt.compare(oldPassword, dbUser.password);

      if (!passwordsMath) {
        return response.status(401).json({
          status: 'error',
          code: 401,
          error: `Contraseña incorrecta`
        });
      }

      // hash nueva password

      const dbNewPassword = await bcrypt.hash(newPassword, 10);

      await connection.query(`
        UPDATE users 
        SET password=? ,last_password_update=? 
        WHERE id=?
    `,
        [dbNewPassword, dateNow, id]
      );

      response.send({
        status: 'ok',
        message: 'La contraseña se ha actualizado correctamente, vuelve a hacer login'
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  },
  deactivate: async (request, response, next) => {
    try {

      // we open connection to db and get user id and code activation
      connection = await getConnection();
      const {
        id
      } = request.params;

      // we select user role from id
      const [resultUser] = await connection.query(`
        SELECT role 
        FROM users 
        WHERE id=?`,
        [id]);

      const [user] = resultUser;
      const {
        role
      } = user;

      if (role === 'admin') {
        // we build a SQL query to update and to activate the user account
        const [result] = await connection.query(`
        UPDATE users
        SET isActive=0
        WHERE id=?
        `,
          [id]);

        if (result.affectedRows === 0) {
          return response.status(400).json({
            status: 'error',
            code: 400,
            error: `No se pudo desactivar el usuario`
          });
        }
      } else {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `No tienes permisos de administrador`
        });
      }

      return response.status(200).json({
        message: `La cuenta ha sido desactidava`,
      });

    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }


}

module.exports = {
  usersController
};