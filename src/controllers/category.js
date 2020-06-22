'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');
const {categorySchema} = require('../validations');
const { helpers } = require('../helpers');
const path = require('path');
const category = require('../validations/category');
let dateNow = helpers.formatDateToDB(new Date());
let creating_date = helpers.formatDateJSON(new Date());
let categoryImagePath = path.join(__dirname, `../${process.env.CATEGORY_UPLOADS_DIR}`);
let connection;

const categoryController = {
  new: async (request, response, next) => {
    try {
      await categorySchema.validateAsync(request.body);

      const {name, image} = request.body;

      let savedFileName;
      if (request.files && request.files.image) {
        try {
          let uploadImageBody = request.files.image;
          savedFileName = await helpers.processAndSavePhoto(categoryImagePath,uploadImageBody);
        } catch (error) {
          throw helpers.errorGenerator(
            'La imagen no ha sido procesada correctamente ,por favor intentalo de nuevo',
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
          // almaceno los datos en newcategory por si los quiero manipular despues en front
          data: {
            name,
            image: savedFileName,
            creation_date: creating_date
          },
          message: 'La categoria fue creada exitosamente'
        });

    } catch (error) {
      /* response.status(500).json({
        message:'Ha ocurrido un error ,la categoria con ese nombre ya existe,por favor intentalo con otro nombre'
      }); */
      next(error);
      
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  get: async (request, response, next) => {
    try {
      const { id } = request.params;
      connection = await getConnection();
      const [result] = await connection.query(`SELECT * FROM category WHERE id = ?`, [id]);
      if (!result.length) {
        throw helpers.errorGenerator(
          `La categoria con el id ${id} no existe`,
          404
        );
      }
      const [categoryResult] = result;
      response.send({
        status: 200,
        data: categoryResult,
        message: 'La busqueda fue realizada con exito'
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
      const [result] = await connection.query(`SELECT * FROM category;`);
      if (!result.length) {
        response.status(404).json({
          status: 'error',
          error:`No hay categorias para mostrar aún`});
      } else {
        response.send({
          status: 200,
          data: result
        });
      }
    } catch (error) {
      next(error);
    }
  },
  update: async (request, response, next) => {
    try {
      const {name,image} = request.body;

      const {id} = request.params;

      await categorySchema.validateAsync(request.body);

      connection = await getConnection();
      const [current] = await connection.query('SELECT image FROM category WHERE id=?', [id]);

      if(!current.length) {
        throw helpers.errorGenerator(`La categoria con el id ${id} no existe`,400);
      };
      if(current[0].image) {
        await helpers.deletePhoto(categoryImagePath, current[0].image);
      };
      
      let savedFileName;

      if (request.files && request.files.image) {
        try { 
          savedFileName = await helpers.processAndSavePhoto(categoryImagePath,request.files.image);
        } catch (error) {
          throw helpers.errorGenerator(
            'La imagen no ha sido procesada correctamente, por favor intentalo de nuevo',
            400);
        }
      } 
      else {
        savedFileName = current.image;
      }
      await connection.query(`UPDATE category SET name=?, image=?, modify_date=? WHERE id=?`,[name, savedFileName,dateNow,id]);
      
      response.send({
        status: 200,
        data: { 
          id,
          name,
          image: savedFileName,
          modify_date: dateNow,
        },
        message: 'La categoria fue modificada satisfactoriamente'
      });
    } catch (error) {
      next(error);
    }finally {
      if (connection) {
        connection.release();
      }
    }
  },
  delete: async (request, response, next) => {
    try {
      const { id } = request.params;
      connection = await getConnection();

      const [result] = await connection.query('SELECT image FROM category WHERE id=?', [id]);
      
      
      if(!result.length) {
        response.status(404).json({
          status: 'error',
          error:`La categoria con el id ${id} no existe`});
      }; 

      if(result && result[0].image) {
        await helpers.deletePhoto(categoryImagePath, result[0].image);
      } else {
        response.status(404).json({
          status: 'error',
          error:`La foto de la categoria con id ${id} no se pudo procesar`});
      }

      await connection.query(` DELETE FROM category WHERE id=?`, [id]);
      response.send({
        status: 200,
        data: result,
        message: `La categoria con id ${id} ha sido borrada satisfactoriamente `
      });
      
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
