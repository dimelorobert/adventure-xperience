'use strict';

import 'dotenv/config';

const {
  PUBLIC_HOST,
  PUBLIC_UPLOADS,
  USERS_UPLOADS_DIR,
  USERS_VIEW_UPLOADS,
  SERVICE_EMAIL,
  ADMIN_EMAIL,
  PASSWORD_ADMIN_EMAIL,
  LOGO_PATH
} = process.env;

import getConnection from '../../database/sequelizeConnection';

//import uCreateSchema from '../../validations/users';

import helpers from '../../helpers';

import path from 'path';

import bcrypt from 'bcrypt';

async function create(request, response, next) {
  let imageToSave;

  try {
    // We validate data with the middleware
    //await uCreateSchema.validateAsync(request.body);

    const {
      name,
      surname,
      date_birth,
      genre,
      country,
      city,
      email,
      password,
      image
    } = request.body;

    // we open connection with database
    let connection = await getConnection();

    // We check if the email exist in database
    const [
      emailExist
    ] = await connection.query(`SELECT id FROM users WHERE email=?`, [email]);

    if (emailExist.length) {
      return response.status(409).json({
        status: 'error',
        code: 409,
        message: `El email ${email} ya esta registrado`
      });
    }

    // We crypt the password before save it in the database
    const cryptedPassword = await bcrypt.hash(password, 10);

    // We generate activation code for account
    const activationCode = helpers.randomString(20);

    // path where it is save the userdata
    const userImagePath = path.join(
      __dirname,
      `../${USERS_UPLOADS_DIR}` /*, `${emailUuid}`*/
    );
    console.log('user immage::::::::::::::', userImagePath);

    // we process image file that we receive into the body

    if (request.files && request.files.image) {
      try {
        let uploadedImageFromReq = request.files.image;

        const imageFeatures = {
          file: uploadedImageFromReq,
          path: userImagePath,
          width: 300,
          heigh: 300
        };

        // we define location path and image size values
        let imageToSaveProcess = await helpers.processAndSavePhoto(
          imageFeatures
        );

        imageToSave = path.join(USERS_UPLOADS_DIR, imageToSaveProcess);

        console.log('image save::::::::::::::', imageToSave);
      } catch (error) {
        return response.status(400).json({
          status: 'error',
          code: 400,
          message:
            'La imagen no ha sido procesada correctamente ,por favor intentalo de nuevo'
        });
      }
    } else {
      // Creamos variable que se encargara de asignar una imagen aleatoria a cada usuario que no envie imagen
      let randomImage = Math.floor(Math.random() * 8) + 1;

      // Creacion del nombre del archivo ex: avatar-5.jpg
      const avatarImage = 'avatar-' + `${randomImage}` + '.jpg';

      // creamos path del archivo
      const pathImageDefault = path.join(
        `./${AVATAR_DEFAULT}`,
        `./${avatarImage}`
      );

      // Asignamos este valor a image y este a su vez a imageToSave para que salga de la condicion null || undefined con el valor que le hemos asigando por defecto
      image = pathImageDefault;
      imageToSave = image;
    }

    // we generate the image link with the path to save into db and to show in front
    let image4Vue = path.join(
      `${PUBLIC_HOST}`,
      `./${USERS_VIEW_UPLOADS}`,
      `./${imageToSave}`
    );

    // we save all data into db
    const [newUserData] = await connection.query(
      `
      INSERT INTO users(name, surname, date_birth, genre, country, city, email, role, password, last_password_update, image, creation_date, ip, reg_Code)
      VALUES( ? , ? , ? , ?, ? , ? , ?, ?, ?, CURRENT_TIMESTAMP(), ? , CURRENT_TIMESTAMP(), ? , ? );
      `,
      [
        name,
        surname,
        date_birth,
        genre,
        country,
        city,
        email,
        role,
        cryptedPassword,
        imageToSave,
        activationCode,
        request.ip
      ]
    );

    // we send an email with the activation link for user account
    const userValidationLink = `${PUBLIC_HOST}/users/${newUserData.insertId}/activate?code=${activationCode}`;
    const pathImageEmail = path.join(
      __dirname,
      `../${PUBLIC_UPLOADS}`,
      `${LOGO_PATH}`
    );

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
            <img src="cid:logo" alt="Logo Aventura Xperience">
            <h1> Activa tu cuenta en Aventura Xperience </h1>
            <p> Para validar la cuenta pega esta URL en tu navegador: ${userValidationLink} o pulsa click en el siguiente enlace:
            <a href="${userValidationLink}" target="_blank">Activa tu cuenta dando click aquí!</a>
            </p>
          </div>`,
          attachments: [
            {
              filename: 'logo.png',
              path: pathImageEmail,
              cid: 'logo' // cid value as in the html img src
            }
          ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
          console.log('Email enviado');
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
        message: `No se pudo enviar el email debido a un error en el servidor`
      });
    }

    // if everything ok, we send all data to json format
    response.send({
      status: 200,
      data: {
        id: newUserData.insertId,
        name: capitalizeName,
        surname: capitalizeSurname,
        date_birth: date_birth,
        genre: genre,
        email: email,
        password: cryptedPassword,
        image: imageToSave,
        role: role,
        creation_date: creating_date,
        ip: request.ip,
        reg_code: activationCode
      },
      message: `Verifica tu buzón de correo email para activar tu cuenta.`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export default create;
