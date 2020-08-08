'use strict';

// Modulos Requeridos
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
let dateNow = helpers.formatDateToDB(new Date());
let creating_date = helpers.formatDateJSON(new Date());
let adventureImagePath = path.join(__dirname, `../${process.env.ADVENTURE_UPLOADS_DIR}`);
let connection;

const adventuresController = {
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
            isAvailable,
            category_id
         } = request.body;
         connection = await getConnection();
         let savedFileName;

         if (request.files && request.files.image) {
            try {
               let uploadImageBody = request.files.image;
               savedFileName = await helpers.processAndSavePhoto(adventureImagePath, uploadImageBody);
            } catch (error) {
               return response.status(400).json({
                  status: 'error',
                  code: 400,
                  error: 'La imagen no ha sido procesada correctamente, por favor intentalo de nuevo'
               });
            }
         } else {
            savedFileName = image;
         }

         const [result] = await connection.query(`
            INSERT INTO adventure(name, description, image, price, country, city, vacancy, isAvailable, creation_date, category_id)
            VALUES( ? , ? , ? , ? , ? , ? , ? , ? , ? , ?);
            `, [name, description, image, price, country, city, vacancy, isAvailable, dateNow, category_id]);

         response.send({
            status: 200,
            data: {
               id: result.insertId,
               name,
               description,
               image,
               price,
               country,
               city,
               vacancy,
               isAvailable,
               creation_date: creating_date,
               category_id
            },
            message: `La aventura con el id ${result.insertId} fue creada exitosamente`
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
         const [result] = await connection.query(`SELECT a.* , AVG(r.points) as averageAdventure FROM adventure a, review r WHERE a.id = r.adventure_id AND a.id =?`, [id]);

         if (!result.length) {
            return response.status(400).json({
               status: 'error',
               code: 400,
               error: `La aventura con id ${id} no existe,por favor intentalo de nuevo`
            });
         } else {
            let [adventureResult] = result;
            response.send({
               status: 200,
               data: {
                  ...adventureResult
               },
               message: `La busqueda de la aventura con el id ${adventureResult.id} fue realizada con exito`
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
         const [result] = await connection.query(`SELECT * FROM adventure;`);
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