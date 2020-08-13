'use strict';

// Modulos Requeridos
require('dotenv').config();
const {
   PUBLIC_HOST,
   ADVENTURE_VIEW_UPLOADS,
   ADVENTURE_UPLOADS_DIR
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
const uuid = require('uuid');
let dateNow = helpers.formatDateToDB(new Date());
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

         let savedFileName;
         let savedFileName1;
         let savedFileName2;
         let savedFileName3;

         const nameProcessed = name.toLowerCase().toLowerCase().split(' ').join('-');
         const folderPathAdventuresImages = path.join(`${adventureImagePath}`, `${nameProcessed}`);


         if (request.files && request.files.image && request.files.image1 && request.files.image2 && request.files.image3) {
            try {
               let uploadImageBody = request.files.image;
               let uploadImageBody1 = request.files.image1;
               let uploadImageBody2 = request.files.image2;
               let uploadImageBody3 = request.files.image3;

               savedFileName = await helpers.processAndSavePhoto(folderPathAdventuresImages, uploadImageBody);
               savedFileName1 = await helpers.processAndSavePhoto(folderPathAdventuresImages, uploadImageBody1);
               savedFileName2 = await helpers.processAndSavePhoto(folderPathAdventuresImages, uploadImageBody2);
               savedFileName3 = await helpers.processAndSavePhoto(folderPathAdventuresImages, uploadImageBody3);
            } catch (error) {
               return response.status(400).json({
                  status: 'error',
                  code: 400,
                  error: 'La imagen #1 no ha sido procesada correctamente, por favor intentalo de nuevo'
               });
            }
         } else {
            savedFileName = image;
            savedFileName1 = image1;
            savedFileName2 = image2;
            savedFileName3 = image3;
         };



         const [result] = await connection.query(`
            INSERT INTO adventures(name, description, image, image1, image2, image3, price, country, city, vacancy, isAvailable, creation_date, start_date_event, category_id)
            VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `, [name, description, savedFileName, savedFileName1, savedFileName2, savedFileName3, price, country, city, vacancy, isAvailable, dateNow, start_date_event, category_id]);

         const imagesAdventuresViews = path.join(`${PUBLIC_HOST}`, `${ADVENTURE_VIEW_UPLOADS}`, `${nameProcessed}`, `${savedFileName}`);
         const imagesAdventuresViews1 = path.join(`${PUBLIC_HOST}`, `${ADVENTURE_VIEW_UPLOADS}`, `${nameProcessed}`, `${savedFileName1}`);
         const imagesAdventuresViews2 = path.join(`${PUBLIC_HOST}`, `${ADVENTURE_VIEW_UPLOADS}`, `${nameProcessed}`, `${savedFileName2}`);
         const imagesAdventuresViews3 = path.join(`${PUBLIC_HOST}`, `${ADVENTURE_VIEW_UPLOADS}`, `${nameProcessed}`, `${savedFileName3}`);

         response.send({
            status: 200,
            data: {
               id: result.insertId,
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
               creation_date: creating_date,
               start_date_event,
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
         const [result] = await connection.query(`
            SELECT a.* , 
            AVG(r.points) as averageAdventure 
            FROM adventures a, reviews r 
            WHERE a.id = r.adventure_id 
            AND a.id =?`,
            [id]);
         console.log(result);

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