'use strict';

require('dotenv').config();
const {
   SECRET_KEY
} = process.env;
const jwt = require('jsonwebtoken');


const authentication = {
   user: async (request, response, next) => {
      try {
         const {
            authorization
         } = request.headers;

         const decoded = jwt.verify(authorization, SECRET_KEY);

         request.auth = decoded

         next();
      } catch (error) {
         return response.status(401).json({
            status: 'error',
            code: 401,
            error: `Autorización incorrecta`
         });
      }

   },
   admin: async (request, response, next) => {
      if (!request.auth || request.auth.role !== 'admin') {

         return response.status(401).json({
            status: 'error',
            code: 401,
            error: 'No tienes privilegios de administrador'
         });
      }
      next();
   },
}

module.exports = {
   authentication
};