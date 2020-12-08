'use strict';

// Modulos Requeridos
require('dotenv').config();
const {
  CATEGORY_UPLOADS_DIR
} = process.env;
const {
  getConnection
} = require('../database/sequelize-connection');
const {
  categoriesSchema
} = require('../validations');
const {
  helpers
} = require('../helpers');
const path = require('path');
const fs = require('fs').promises;
const dateNow = helpers.formatDateToDB(new Date());
const creating_date = helpers.formatDateJSON(new Date());
const categoriesImagePath = path.join(__dirname, `../${CATEGORY_UPLOADS_DIR}`);
let connection;

const categoriesController = {
  create: async (request, response, next) => {
    try {

      // we open connection to db
      connection = await getConnection();

      // we validate received data from body
      await categoriesSchema.validateAsync(request.body);
      const {
        name,
        image
      } = request.body;

      // we processed the name received from body to create a path folder
      const nameProcessed = name.toLowerCase().toLowerCase().split(' ').join('-');
      const capitalizeName = await helpers.capitalize(name);
      const categoriesNameFolder = path.join(categoriesImagePath, `${nameProcessed}`);

      // process image (create folder path, size change ..)
      let savedFileName;
      if (request.files && request.files.image) {
        try {
          let uploadImageBody = request.files.image;
          savedFileName = await helpers.processAndSavePhoto(categoriesNameFolder, uploadImageBody);
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

      // save data into db 
      const [result] = await connection.query(`
        INSERT INTO categories (name, image, creation_date) 
        VALUES( ?, ?, ?);`, [capitalizeName, savedFileName, dateNow]);

      // we send a json with the saved data
      response.send({
        status: 200,
        data: {
          id: result.insertId,
          name: capitalizeName,
          image: savedFileName,
          creation_date: creating_date
        },
        message: `La categoria con el id ${result.insertId} fue creada exitosamente`
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
      const [result] = await connection.query(`
        SELECT id, name, image 
        FROM categories 
        LIMIT 4;`);

      if (!result.length) {
        return response.status(404).json({
          status: 'error',
          code: 400,
          error: `No hay categorias para mostrar aún`
        });
      } else {
        response.send({
          status: 200,
          data: result,
          message: 'Lista de todas las categorias creadas'
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

      const [result] = await connection.query(`
        SELECT name, image 
        FROM categories 
        WHERE id = ?`,
        [id]);

      if (!result.length) {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `La categoria con id ${id} no existe,por favor intentalo de nuevo`
        });
      } else {
        const [categoryResult] = result;
        response.send({
          status: 200,
          data: categoryResult,
          message: `La busqueda de la categoria con el id ${categoryResult.id} fue realizada con exito`
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
      connection = await getConnection();
      await categoriesSchema.validateAsync(request.body);
      const {
        name,
        image,
      } = request.body;
      const {
        id
      } = request.params;

      const [current] = await connection.query(`
        SELECT name, image
        FROM categories 
        WHERE id=?`,
        [id]);

      if (!current.length) {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `La categoria con el id ${id} no existe`
        });
      };

      const nameBodyProcessed = name.toLowerCase().split(' ').join('-');
      const nameProcessedDB = current[0].name.toLowerCase().split(' ').join('-');
      const categoriesNameOldDirPath = path.join(categoriesImagePath, `${nameProcessedDB}`);
      const categoriesNameNewDirPath = path.join(categoriesImagePath, `${nameBodyProcessed}`);


      if (current && current[0].image && current[0].name) {
        await helpers.deletePhoto(categoriesNameOldDirPath, current[0].image);
        await helpers.deleteFolder(categoriesNameOldDirPath);
      } else {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `La foto de la categoria con id ${id} no se pudo procesar correctamente`
        });
      }

      let savedFileName;

      if (request.files && request.files.image) {
        try {
          savedFileName = await helpers.processAndSavePhoto(categoriesNameNewDirPath, request.files.image);
        } catch (error) {
          return await response.status(400).json({
            status: 'error',
            code: 400,
            error: 'La imagen no ha sido procesada correctamente ,por favor intentalo de nuevo'
          });
        }
      } else {
        savedFileName = current.image;
      }
      await connection.query(`
        UPDATE categories 
        SET name=?, image=?, modify_date=? 
        WHERE id=?`,
        [name, savedFileName, dateNow, id]);

      response.send({
        status: 200,
        data: {
          id,
          name,
          image: savedFileName,
          modify_date: creating_date,
        },
        message: `La categoria con el id ${id} fue modificada satisfactoriamente`
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
        SELECT name, image 
        FROM categories 
        WHERE id=?`, [id]);


      if (!result.length) {
        return response.status(404).json({
          status: 'error',
          error: `La categoria con el id ${id} no existe`
        });
      };

      const nameProcessedDB = result[0].name.toLowerCase().split(' ').join('-');
      const categoriesNameFolder = path.join(categoriesImagePath, `${nameProcessedDB}`);

      if (result && result[0].image) {
        await helpers.deletePhoto(categoriesNameFolder, result[0].image);
        await helpers.deleteFolder(categoriesNameFolder);
      } else {
        return response.status(400).json({
          status: 'error',
          code: 400,
          error: `La foto de la categoria con id ${id} no se pudo procesar correctamente`
        });
      }

      await connection.query(` DELETE FROM categories WHERE id=?`, [id]);
      response.send({
        status: 200,
        message: `La categoria con id ${id} ha sido borrada satisfactoriamente `
      });

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
  categoriesController
};