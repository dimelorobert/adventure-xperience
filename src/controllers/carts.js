'use strict';

// Modulos Requeridos
require('dotenv').config();
const {
	PUBLIC_HOST,
	SECRET_KEY,
	PUBLIC_UPLOADS,
	LOGO_PATH,
	SERVICE_EMAIL,
	ADMIN_EMAIL,
	PASSWORD_ADMIN_EMAIL
} = process.env;
const path = require('path');
const {
	getConnection
} = require('../database');
const {
	helpers
} = require('../helpers');
const nodemailer = require('nodemailer');
let connection;

const cartsController = {
	create: async (request, response, next) => {
		try {
			connection = await getConnection();
			const {
				total_price,
				adventure_id,
				status
			} = request.body;
			const {
				tokenPayload
			} = request.authorization;
			console.log(tokenPayload);
			const {
				id,
				email
			} = tokenPayload;

			const [user] = await connection.query(`
            SELECT name, surname
            FROM users 
            WHERE id=?`, [id]);

			const [adventureSelected] = await connection.query(`
            SELECT name, country, city , start_date_event 
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
				city,
				start_date_event
			} = destructuringNameCountryCity;

			await connection.query(`
            UPDATE adventures
            SET date_selected=CURRENT_TIMESTAMP() 
            WHERE id=?;`, [adventure_id]);

			let booking;
			let bookingPay;
			if (status === 'reservada') {

				bookingPay = 'reserva';

				[booking] = await connection.query(`
               INSERT INTO cart(purchased_date, date_booking, total_price, status, user_id, adventure_id)
               VALUES(null, CURRENT_TIMESTAMP(), ?, 'reservada', ?, ? );`,
					[total_price, id, adventure_id]);

			} else if (status === 'pagada') {

				bookingPay = 'compra';
				[booking] = await connection.query(`
               INSERT INTO cart(purchased_date, date_booking, total_price, status, user_id, adventure_id)
               VALUES(CURRENT_TIMESTAMP(), null,  ?, 'pagada', ?, ? );`,
					[total_price, id, adventure_id]);

			} else {
				return response.status(404).json({
					status: 'error',
					code: 404,
					error: 'No ha sido posible efectuar la reserva o la compra de la aventura seleccionada'
				});
			}

			const dateProcessed = await helpers.formatDate4Vue(start_date_event);

			// we check if the email exist into db
			const [existingEmail] = await connection.query(`SELECT email FROM users WHERE id=?`, [id]);

			const pathImageEmail = path.join(__dirname, `../${PUBLIC_UPLOADS}`, `${LOGO_PATH}`);
			

			if (existingEmail.length) {
				try {
					const transporter = nodemailer.createTransport({
						service: SERVICE_EMAIL,
						auth: {
							user: ADMIN_EMAIL,
							pass: PASSWORD_ADMIN_EMAIL
						}
					});
					const mailOptions = {
						from: ADMIN_EMAIL,
						to: `${email}`,
						subject: `Nueva ${bookingPay} Aventura Xperience`,
						text: `Este email es para confirmar tu ${bookingPay} realizada en la web aventura Xperience`,
						html: `
            <div>
               <img src="cid:logo" alt="Logo Aventura Xperience"> <h1><strong>Aventura</strong> Xperience</h1>
              	<h2> Ticket de ${bookingPay} Nº.ticket: ${booking.insertId} </h2>
             	<p> Hola ${user[0].name} ${user[0].surname}:</p>
              <p> Has efectuado la ${bookingPay} de la siguiente aventura</p>
              <h3>Datos de la aventura creada: </h3>
              <br>
              <spa> Id de la aventura: ${adventure_id}</spa>
              <br> 
              <spa> Id usuario: ${id}</spa>
              <br>
              <spa> nombre: ${name}</spa>
              <br>
              <spa> Precio: ${total_price}</spa>
              <br>
              <spa> País - Ciudad: ${country} - ${city}</spa>
              <br>
              <spa> Fecha del evento: ${dateProcessed}</spa>
              <br>
            </div>`,
						attachments: [{
							filename: 'logo.png',
							path: pathImageEmail,
							cid: 'logo' //same cid value as in the html img src
						}]
					};

					transporter.sendMail(mailOptions, (error, info) => {

						response.status(200).json(request.body);

					});

				} catch (error) {
					console.log(error);
					if (error) {
						response.status(500).send(error.message);
					}
				}

			} else {
				return response.status(500).json({
					status: 'error',
					code: 500,
					error: `No se pudo enviar el email debido a un error en el servidor`
				});
			}


			response.send({
				status: 200,
				data: {
					adventure_id,
					adventure: name,
					city_country: `${city} - ${country}`,
					price: total_price,
					status
				},
				message: `La aventura ${name} en ${city} - ${country} fue ${status} con éxito`
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