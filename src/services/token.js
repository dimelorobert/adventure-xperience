'use strict';

require('dotenv').config();
const {
   SECRET_KEY
} = process.env;
const {
   getConnection
} = require('../database');
const jwt = require('jsonwebtoken');
const {
   userSchema
} = require('../validations');
let connection;

async function checkToken(token) {
   let __id = null;
   try {
      const {
         _id
      } = jwt.decode(token);
      __id = _id;
   } catch (error) {
      return false;
   }
   await loginSchema.validateAsync(request.body);
   const {
      email
   } = request.body;
   connection = await getConnection();

   const [userEmailDB] = await connection.query(`SELECT id, name, email, password, role FROM user WHERE email=?`, [email]);
   const [user] = userEmailDB;
   if (user) {
      const token = jwt.sign({
         _id: _id
      }, SECRET_KEY, {
         expiresIn: '1d'
      });
      return {
         token,
         role: user.role
      };
   } else {
      return false;
   }
}

const getToken = {

   encode: async (_id) => {
      const token = jwt.sign({
         _id: _id
      }, SECRET_KEY, {
         expiresIn: '1d'
      });
      return token;

   },
   decode: async (token) => {
      try {

         const {
            _id
         } = jwt.verify(token, SECRET_KEY);

         await loginSchema.validateAsync(request.body);
         const {
            email
         } = request.body;
         connection = await getConnection();

         const [userEmailDB] = await connection.query(`SELECT id, name, email, password, role FROM user WHERE email=?`, [email]);
         const [user] = userEmailDB;


         if (user) {
            return user;
         } else {
            return false;
         }
      } catch (error) {
         const newToken = await checkToken(token);
         return newToken;
      }

   }

}

module.exports = {
   getToken
};