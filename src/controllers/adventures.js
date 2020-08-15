'use strict';

// Modulos Requeridos
require('dotenv').config();
const {
   PUBLIC_HOST,
   ADVENTURE_VIEW_UPLOADS,
   ADVENTURE_UPLOADS_DIR,
   SECRET_KEY,
   SERVICE_EMAIL,
   ADMIN_EMAIL,
   PASSWORD_ADMIN_EMAIL
} = process.env;
const {
   getConnection
} = require('../database');
const {
   adventuresSchema
} = require('../validations');
const {
   helpers
} = require('../helpers');
const path = require('path');
const jwt = require('jsonwebtoken');
let dateNow = helpers.formatDateToDB(new Date());
const nodemailer = require('nodemailer');
let creating_date = helpers.formatDateJSON(new Date());
let adventureImagePath = path.join(__dirname, `../${ADVENTURE_UPLOADS_DIR}`);
let connection;

const adventuresController = {
   create: async (request, response, next) => {
      try {
         connection = await getConnection();

         await adventuresSchema.validateAsync(request.body);
         const {
            name,
            description,
            image,
            image1,
            image2,
            image3,
            price,
            country,
            city,
            vacancy,
            isAvailable,
            start_date_event,
            category_id
         } = request.body;



         const {
            authorization
         } = request.headers;


         let decoded;

         try {
            decoded = jwt.verify(authorization, SECRET_KEY);
         } catch (error) {
            return response.status(401).json({
               status: 'error',
               code: 401,
               error: `token incorrecto`
            });
         }

         // we get the user id 
         const {
            tokenPayload
         } = decoded;
         const {
            id,
            role
         } = tokenPayload;

         // processing photos
         let savedFileName;
         let savedFileName1;
         let savedFileName2;
         let savedFileName3;
         let imagesAdventuresViews;
         let imagesAdventuresViews1;
         let imagesAdventuresViews2;
         let imagesAdventuresViews3;

         const nameProcessed = name.toLowerCase().toLowerCase().split(' ').join('-');
         const folderPathAdventuresImages = path.join(`${adventureImagePath}`, `${nameProcessed}`);


         if (request.files && request.files.image) {
            try {
               let uploadImageBody = request.files.image;
               savedFileName = await helpers.processAndSavePhoto(folderPathAdventuresImages, uploadImageBody);
               imagesAdventuresViews = path.join(`${PUBLIC_HOST}`, `${ADVENTURE_VIEW_UPLOADS}`, `${nameProcessed}`, `${savedFileName}`);
            } catch (error) {
               return response.status(400).json({
                  status: 'error',
                  code: 400,
                  error: 'La imagen #1 no ha sido procesada correctamente, por favor intentalo de nuevo'
               });
            }
         } else {
            savedFileName = image;
         };

         if (request.files && request.files.image1) {
            try {
               let uploadImageBody1 = request.files.image1;
               savedFileName1 = await helpers.processAndSavePhoto(folderPathAdventuresImages, uploadImageBody1);
               imagesAdventuresViews1 = path.join(`${PUBLIC_HOST}`, `${ADVENTURE_VIEW_UPLOADS}`, `${nameProcessed}`, `${savedFileName1}`);
            } catch (error) {
               return response.status(400).json({
                  status: 'error',
                  code: 400,
                  error: 'La imagen #1 no ha sido procesada correctamente, por favor intentalo de nuevo'
               });
            }
         } else {
            savedFileName1 = image1;
         };

         if (request.files && request.files.image2) {
            try {
               let uploadImageBody2 = request.files.image2;
               savedFileName2 = await helpers.processAndSavePhoto(folderPathAdventuresImages, uploadImageBody2);
               imagesAdventuresViews2 = path.join(`${PUBLIC_HOST}`, `${ADVENTURE_VIEW_UPLOADS}`, `${nameProcessed}`, `${savedFileName2}`);

               if (request.files && request.files.image2 === undefined) {
                  savedFileName2 = null;
               }
            } catch (error) {
               return response.status(400).json({
                  status: 'error',
                  code: 400,
                  error: 'La imagen #1 no ha sido procesada correctamente, por favor intentalo de nuevo'
               });
            }
         } else {
            savedFileName2 = image2;
         };

         if (request.files && request.files.image3) {
            try {
               let uploadImageBody3 = request.files.image3;
               savedFileName3 = await helpers.processAndSavePhoto(folderPathAdventuresImages, uploadImageBody3);
               imagesAdventuresViews3 = path.join(`${PUBLIC_HOST}`, `${ADVENTURE_VIEW_UPLOADS}`, `${nameProcessed}`, `${savedFileName3}`);
            } catch (error) {
               return response.status(400).json({
                  status: 'error',
                  code: 400,
                  error: 'La imagen #1 no ha sido procesada correctamente, por favor intentalo de nuevo'
               });
            }
         } else {
            savedFileName3 = image3;
         };

         const [newAdventureData] = await connection.query(`
            INSERT INTO adventures(name, description, image, image1, image2, image3, price, country, city, vacancy, isAvailable, creation_date, start_date_event, category_id, user_id)
            VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `, [name, description, imagesAdventuresViews, imagesAdventuresViews1, imagesAdventuresViews2, imagesAdventuresViews1, price, country, city, vacancy, isAvailable, dateNow, start_date_event, category_id, request.headers.authorization.id]);

         // we check if the email exist into db
         const [dataUser] = await connection.query(`
            SELECT name, surname, email 
            FROM users 
            WHERE id=?`,
            [id]);

         let activateAdventure = 0;
         if (role === 'admin') {
            activateAdventure = 1;

            await connection.query(`
            UPDATE adventures 
            SET isActive=? 
            WHERE id=?
         `, [activateAdventure, newAdventureData.insertId]);
         } else {
            if (!dataUser.length.error) {
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
                     to: `${dataUser[0].email}`,
                     subject: `Tu aventura de aventura Xperience esta pendiente de revisión`,
                     text: `En breves recibiras un correo con un link para activar la aventura que acabas de crear `,
                     html: `
            <div>
              <h1> Aventura En Revisión </h1>
              <p> Hola ${dataUser[0].name} ${dataUser[0].surname} :</p>
              <p> En breves recibiras un correo con un link para activar la aventura que acabas de crear</p>
              <br>
              <h2>Datos de la aventura creada: </h2>
              <br>
              <spa> Id de la aventura: ${newAdventureData.insertId}</spa>
              <br>
              <img src="${imagesAdventuresViews}">
              <br>
              <spa> Nombre: ${name}</spa>
              <br>
              <spa> Descripción: ${description}</spa>
              <br>
              <spa> Precio: ${price}</spa>
              <br>
              <spa> Vacantes: ${vacancy}</spa>
              <br>
              <spa> País - Ciudad: ${country} - ${city}</spa>
              <br>
              <spa> Fecha del evento: ${start_date_event}</spa>
              <br>
            
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

            } else {
               return response.status(500).json({
                  status: 'error',
                  code: 500,
                  error: `No se pudo enviar el email debido a un error en el servidor`
               });
            }

         }


         response.send({
            status: 200,
            data: {
               id: newAdventureData.insertId,
               name,
               description,
               image: imagesAdventuresViews,
               image1: imagesAdventuresViews1,
               image2: imagesAdventuresViews2,
               image3: imagesAdventuresViews3,
               price,
               country,
               city,
               vacancy,
               isAvailable,
               isActive: activateAdventure,
               creation_date: creating_date,
               start_date_event,
               category_id,
               user_id: id
            },
            message: `La aventura  ${name} con el id ${newAdventureData.insertId} fue creada exitosamente`
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
         connection = await getConnection();
         // const [result] = await connection.query(`
         //    SELECT id, name, description, image, price, country, city, vacancy, isAvailable, start_date_event 
         //    FROM adventures;`);

         /*const [result] = await connection.query(`
            SELECT name, description, image, price, country, city, vacancy, isAvailable, isActive, start_date_event 
            FROM adventures 
            WHERE isActive=1;
         `);*/
         const {
            search,
            filter
         } = req.query;

         let result;

         if (search && filter === 'name') {}

         if (!result.length) {
            return response.status(404).json({
               status: 'error',
               code: 400,
               error: `No hay aventuras para mostrar aún`
            });
         } else {
            response.send({
               status: 200,
               data: result,
               message: 'Lista de todas las aventuras creadas'
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
   get: async (request, response, next) => {
      try {
         connection = await getConnection();

         const {
            id
         } = request.params;

         /*const [result] = await connection.query(`
            SELECT a.id, a.name, a.description, a.image, a.price, a.country, a.city, a.vacancy, a.isAvailable, a.start_date_event,
            AVG(r.points) as averageAdventure 
            FROM adventures a, reviews r 
            WHERE a.id = r.adventure_id 
            AND a.id =?;`,
            [id]);
         console.log(result);*/

         if (!result.length) {

            return response.status(400).json({
               status: 'error',
               code: 400,
               error: `La aventura con id ${id} no existe,por favor intentalo de nuevo`
            });
         }

         let [adventureResult] = result;
         response.send({
            status: 200,
            data: {
               ...adventureResult
            },
            message: `La busqueda de la aventura con el id ${adventureResult.id} fue realizada con exito`
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
         await adventuresSchema.validateAsync(request.body);
         const {
            name,
            description,
            image,
            price,
            country,
            city,
            vacancy,
            isAvailable
         } = request.body;
         const {
            id
         } = request.params;

         connection = await getConnection();
         const [current] = await connection.query('SELECT image FROM adventure WHERE id=?', [id]);

         if (!current.length) {
            return response.status(400).json({
               status: 'error',
               code: 400,
               error: `La aventura con el id ${id} no existe`
            });

         };
         if (current[0].image) {
            await helpers.deletePhoto(adventureImagePath, current[0].image);
         };

         let savedFileName;

         if (request.files && request.files.image) {
            try {
               savedFileName = await helpers.processAndSavePhoto(adventureImagePath, request.files.image);
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
         await connection.query(`UPDATE adventure SET name=?, description=?, image=?, price=?, country=?, city=?, vacancy=?, isAvailable=?, modify_date=? WHERE id=?`, [name, description, image, price, country, city, vacancy, isAvailable, dateNow, id]);

         response.send({
            status: 200,
            data: {
               id,
               name,
               description,
               image,
               price,
               country,
               city,
               vacancy,
               isAvailable,
               modify_date: creating_date,
            },
            message: `La aventura con el id ${id} fue modificada satisfactoriamente`
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

         const [result] = await connection.query('SELECT image FROM adventure WHERE id=?', [id]);


         if (!result.length) {
            return response.status(404).json({
               status: 'error',
               code: 404,
               error: `La aventura con el id ${id} no existe`
            });
         };

         if (result && result[0].image) {
            await helpers.deletePhoto(adventureImagePath, result[0].image);
         } else {
            return response.status(400).json({
               status: 'error',
               code: 400,
               error: `La foto de la aventura con el id ${id} no se pudo procesar correctamente`
            });
         }


         //await connection.query(` DELETE points FROM review WHERE adventure_id=?`, [id]);
         await connection.query(` DELETE FROM adventure WHERE id=?`, [id]);

         response.send({
            status: 200,
            message: `La aventura con id ${id} ha sido borrada satisfactoriamente `
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

      } catch (error) {
         next(error);
      } finally {
         if (connection) {
            connection.release();
         }
      }
   },
   deactivate: async (request, response, next) => {
      try {

      } catch (error) {
         next(error);
      } finally {
         if (connection) {
            connection.release();
         }
      }
   }
};

module.exports = {
   adventuresController
};