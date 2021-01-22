'use strict';

// Modulos Requeridos
require('dotenv').config();
const {
	PUBLIC_UPLOADS,
	LOGO_PATH,
	SERVICE_EMAIL,
	ADMIN_EMAIL,
	PASSWORD_ADMIN_EMAIL
} = process.env;
const path = require('path');
const {
	cartSchema
} = require('../validations');
const {
	getConnection
} = require('../database/sequelize-connection');
const {
	helpers
} = require('../../helpers');
const nodemailer = require('nodemailer');
let connection;

const cartsController = {
	create: async (request, response, next) => {
		try {
			connection = await getConnection();
			await cartSchema.validateAsync(request.body);
			const {
				adventure_id,
				status,
				quantity,
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
            SELECT name, country, city , start_date_event, vacancy, isAvailable, price
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
				start_date_event,
				vacancy,
				isAvailable,
				price
			} = destructuringNameCountryCity;

			if (isAvailable === 'no disponible' || vacancy === 0) {

				return response.status(404).json({
					status: 'error',
					code: 404,
					error: 'No ha sido posible efectuar la reserva o la compra de la aventura seleccionada por que no esta disponible'
				});
			}

			if (quantity > vacancy) {
				return response.status(404).json({
					status: 'error',
					code: 404,
					error: 'Oops...La cantidad de plazas seleccionadas excede el numero de plazas disponibles, verifica tu selección e intentalo de nuevo'
				});
			}
			let totallyPrice = await (await helpers.increment(quantity, price)).toFixed(2);
			
			if (!totallyPrice) {
				return response.status(401).json({
					status: 'error',
					code: 401,
					error: 'Ha ocurrido un error al procesar su reserva o compra'
				});
			}
			console.log(totallyPrice);

			await connection.query(`
            UPDATE adventures
            SET date_selected=CURRENT_TIMESTAMP() 
            WHERE id=?;`, [adventure_id]);

			let booking;
			let bookingPay;
			let vacancyStock = await helpers.decrement(vacancy, quantity);




			if (status === 'reservada') {

				bookingPay = 'reserva';

				[booking] = await connection.query(`
               INSERT INTO cart(purchase_date, date_booking, total_price, status, user_id, adventure_id)
               VALUES(null, CURRENT_TIMESTAMP(), ?, 'reservada', ?, ? );`,
					[totallyPrice, id, adventure_id]);

			} else if (status === 'pagada') {

				await connection.query(`
            UPDATE adventures
            SET vacancy=?
            WHERE id=?;`, [vacancyStock, adventure_id]);

				bookingPay = 'compra';
				[booking] = await connection.query(`
               INSERT INTO cart(quantity, purchase_date, date_booking, total_price, status, user_id, adventure_id)
               VALUES(?,CURRENT_TIMESTAMP(), null,  ?, 'pagada', ?, ? );`,
					[quantity, totallyPrice, id, adventure_id]);

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
               <img src="cid:logo" alt="Logo Aventura Xperience">
              	<h2> Ticket de ${bookingPay} Nº.ticket: ${booking.insertId} </h2>
             	<p> Hola ${user[0].name} ${user[0].surname}:</p>
              <p> Has efectuado la ${bookingPay} de ${quantity} plaza(s) en la siguiente aventura: </p>
              <h3>Datos de la aventura creada: </h3>
              <br>
              <spa> Id de la aventura: ${adventure_id}</spa>
              <br> 
              <spa> Id usuario: ${id}</spa>
              <br>
				  <spa> Actividad: ${name}</spa>
				  <br>
              <spa> Plazas compradas: ${quantity}</spa>
              <br>
              <spa> Precio total: ${totallyPrice}</spa>
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
					price: totallyPrice,
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

	},
	list: async (request, response, next) => {
		try {

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

		} catch (error) {
			next(error);
		} finally {
			if (connection) {
				connection.release();
			}
		}
	},
}
module.exports = {
	cartsController
};