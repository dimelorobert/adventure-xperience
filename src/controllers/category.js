'use strict';

// Modulos Requeridos
const { getConnection } = require('../database');
const {categorySchema} = require('../validations');
const { helpers } = require('../helpers');
let connection;

const categoryController = {
  add: async (request, response, next) => {
    try {
      connection = await getConnection();
      const registry = await categorySchema.validateAsync(request.body);
      const [categories] = await connection.query(`SELECT * FROM category;`);
      response.status(200).json(registry);
      response.send({
        status: 200,
        data: categories
      });
      console.log('Your searching was succesfully');
    } catch (error) {
      next(error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  search: async (request, response, next) => {
    try {
      console.log();
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
      console.log();
    } catch (error) {
      next(error);
    }
  },
  update: async (request, response, next) => {
    try {
      console.log();
    } catch (error) {
      next(error);
    }
  },
  remove: async (request, response, next) => {
    try {
      console.log();
    } catch (error) {
      next(error);
    }
  },
  activate: async (request, response, next) => {
    try {
      console.log();
    } catch (error) {
      next(error);
    }
  },
  deactivate: async (request, response, next) => {
    try {
      console.log();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = { categoryController };
