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
         const {
            total_price,
            adventure_id,
            paid
         } = request.body;
         const {
            tokenPayload
         } = request.authorization;
         console.log(tokenPayload);
         const {
            id
         } = tokenPayload;


         const [adventureSelected] = await connection.query(`
            SELECT name, country, city 
            FROM adventures 
            WHERE id=?`, [adventure_id]);

         if (!adventureSelected.length) {
            return response.status(400).json({
               status: 'error',
               code: 400,
               error: `La aventura con el id ${adventure_id} no existe`
            });
         }

         const [destructuringNameCountryCity] = adventureSelected;
         const {
            name,
            country,
            city
         } = destructuringNameCountryCity;

         await connection.query(`
            UPDATE adventures
            SET date_selected=CURRENT_TIMESTAMP() 
            WHERE id=?;`, [adventure_id]);


         if (paid === 'reservado') {
            const [newBooking] = await connection.query(`
               INSERT INTO cart(purchased_date, date_booking, total_price, paid, user_id, adventure_id)
               VALUES(null, CURRENT_TIMESTAMP(), ?, 'reservado', ?, ? );`,
               [total_price, id, adventure_id]);

         } else if (paid === 'pagado') {
            const [newBooking] = await connection.query(`
            INSERT INTO cart(purchased_date, date_booking, total_price, paid, user_id, adventure_id)
            VALUES(CURRENT_TIMESTAMP(), null,  ?, 'reservado', ?, ? );
            `, [total_price, id, adventure_id]);

         } else {
            return response.status(404).json({
               status: 'error',
               code: 404,
               error: 'No ha sido posible efectuar la reserva o la compra de la aventura seleccionada'
            });
         }
         response.send({
            status: 200,
            data: {
               adventure_id,
               adventure: name,
               city_country: `${city} - ${country}`,
               price: total_price,
               paid
            },
            message: `La averntura ${name} en ${city} - ${country} fue ${paid} con éxito`
         });

      } catch (error) {
         next(error);
      } finally {
         if (connection) {
            connection.release();
         }
      }

   }
}
module.exports = {
   cartsController
};