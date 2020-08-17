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

const cartsController = {
   create: async (request, response, next) => {
      try {
         connection = await getConnection();
         const { total_price, adventure_id} = request.body;
         const {
            tokenPayload
         } = request.authorization;
         console.log(tokenPayload);
         const {
            id
         } = tokenPayload;
         const [newBooking] = await connection.query(`
            INSERT INTO cart(total_price, user_id, purchased_date, paid, adventure_id)
            VALUES(?, ? , CURRENT_TIMESTAMP(), 'reservado', ?)`,[total_price,id,adventure_id]
         
            
         );
         

         response.send({
            status: 200,
            message: `La reserva esta hecha `
         });

      } catch (error) {
         console.log(error);
      }
   }
   
}
module.exports = {
   cartsController
};