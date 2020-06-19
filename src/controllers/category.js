'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');
const {categorySchema} = require('../validations');
const { helpers } = require('../helpers');
const path = require('path');
let dateNow = helpers.formatDateToDB(new Date());
let creating_date = helpers.formatDateJSON(new Date());
let categoryImagePath = path.join(__dirname, `../${process.env.CATEGORY_UPLOADS_DIR}`);
let connection;

const categoryController = {
  add: async (request, response, next) => {
    try {
      await categorySchema.validateAsync(request.body);
      const {name, image} = request.body;
      let savedFileName;
      if (request.files && request.files.image) {
        try {
          let uploadImageBody = request.files.image;
          savedFileName = await helpers.processAndSavePhoto(uploadImageBody, categoryImagePath);
        } catch (error) {
          throw helpers.errorGenerator(
            'Image have not been saved in database, try again,please',
            400
          );
        }
      }
      connection = await getConnection();
      await connection.query(`
        INSERT INTO category(name, image, creation_date) 
        VALUES(?, ?, ?);`,[name, savedFileName, dateNow]);
        response.send({
          status: 200,
          // almaceno los datos en newUser por si los quiero manipular despues
          data: {
            name,
            savedFileName,
            creating_date
          },
          message: 'Your category was created succesfully.'
        });

    } catch (error) {
      response.status(500).send({
        message:'Ocurrio un error al crear la categoria ,intentalo de nuevo'
      })
      next(error);
      
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  query: async (request, response, next) => {
    try {
      c
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
      const [categories] = await connection.query(`SELECT * FROM category;`);
      response.send({
        status: 200,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (request, response, next) => {
    try {
      
    } catch (error) {
      next(error);
    }finally {
      if (connection) {
        connection.release();
      }
    }
  },
  remove: async (request, response, next) => {
    try {
      
    } catch (error) {
      next(error);
    }finally {
      if (connection) {
        connection.release();
      }
    }
  },
  activate: async (request, response, next) => {
    try {
      
    } catch (error) {
      next(error);
    }finally {
      if (connection) {
        connection.release();
      }
    }
  },
  deactivate: async (request, response, next) => {
    try {
      
    } catch (error) {
      next(error);
    }finally {
      if (connection) {
        connection.release();
      }
    }
  }
};

module.exports = { categoryController };
