require('dotenv').config();
const {
   SECRET_KEY
} = process.env;

const jwt = require('jsonwebtoken');

const {
   getConnection
} = require('../database');
const {
   helpers
} = require('../helpers');

let connection;


async function userAuthenticated(request, response, next) {

   try {
      connection = await getConnection();
      const {
         authorization
      } = request.headers;
      let decoded;
      try {
         decoded = jwt.verify(authorization, SECRET_KEY);
         console.log(authorization);
      } catch (error) {
         return response.status(500).json({
            status: 'error',
            code: 500,
            error: `El token no esta bien formado`
         });;
      }

      const {
         id,
         iat
      } = decoded;
      const [result] = connection.query(`
         SELECT last_password_update FROM user WHERE id=?`, [id]);

      if (!result.length) {
         return response.status(404).json({
            status: 'error',
            code: 404,
            error: `El usuario con el id ${user.id} no existe`
         });
      };
      const [user] = result;

      if (new Date(iat * 1000) < new Date(user.last_password_update)) {
         return response.status(404).json({
            status: 'error',
            code: 404,
            error: `El token ha expirado, inicia sesión para renovarlo`
         });
      };
      request.authorization = decoded
      next();
   } catch (error) {
      error.http = 401;
      next(error);
   } finally {
      if (connection) {
         connection.release();
      }
   }

   function userIsAdmin(request, response, next) {
      if (!request.authorization || request.authorization.role !== 'admin') {
         helpers.errorGenerator(('No tienes privilegios de administrador'), 401);
         return next(error);
      }
   }
   next();
}

module.exports = {
   userAuthenticated
};