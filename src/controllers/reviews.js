

'use strict';

const {
	getConnection
} = require('../database/sequelize-connection');
const {
	reviewsSchema
} = require('../validations');
const {
	helpers
} = require('../helpers');
let dateNow = helpers.formatDateToDB(new Date());
let connection;

const reviewsController = {
	vote: async (request, response, next) => {
		try {

			const {
				id
			} = request.params;
			await reviewsSchema.validateAsync(request.body);
			const {
				points,
				comments
			} = request.body;
			connection = await getConnection();

			const [adventure] = await connection.query(`SELECT id, name FROM adventures WHERE id=?`, [id]);

			if (!adventure.length) {
				return response.status(404).json({
					status: 'error',
					code: 404,
					error: `La aventura con el id ${id} no existe`
				});
			}

			const ip = request.ip
			const [existingReview] = await connection.query(`SELECT id FROM reviews WHERE adventure_id=? AND ip=?`, [id, ip]);

			/*if (existingReview.length) {
				return response.status(403).json({
					status: 'error',
					code: 403,
					error: `Lo siento, ya has votado la aventura ${adventure[0].name} con el id ${id} `
				});
			}*/

			const [result] = await connection.query(`INSERT INTO reviews (adventure_id, points, comments, date_post, ip) VALUES(?, ?, ?, ?, ?);`, [id, points, comments, dateNow, ip]);

			response.send({
				status: 200,
				data: adventure,
				message: `La votación de la aventura ${adventure[0].name} con el id ${id} fue realizada con exito`
			});

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
			const {
				id
			} = request.params;
			connection = await getConnection();

			const [reviews] = await connection.query(` SELECT * FROM reviews WHERE adventure_id=?`, [id]);

			if (!reviews.length) {
				return response.status(404).json({
					status: 'error',
					code: 404,
					error: `La votación con el id ${id} no existe`
				});
			};

			response.send({
				status: 200,
				data: reviews,
				message: `Resultado de todas las votaciones de una aventura en especifico`
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
			const [result] = await connection.query(`SELECT * FROM reviews;`);
			if (!result.length) {
				return response.status(404).json({
					status: 'error',
					code: 400,
					error: `No hay votaciones para mostrar aún`
				});
			} else {
				response.send({
					status: 200,
					data: result,
					message: 'Resultado de votaciones creadas'
				});
			}
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
			const {
				id
			} = request.params;
			await reviewSchema.validateAsync(request.body);
			const {
				points,
				comments
			} = request.body;
			connection = await getConnection();

			const [review] = await connection.query(`SELECT id FROM reviews WHERE id=?`, [id]);

			if (!review.length) {
				return response.status(404).json({
					status: 'error',
					code: 404,
					error: `La votación de la aventura con el id ${id} no existe`
				});
			}

			await connection.query(`UPDATE reviews SET points=?, comments=?, date_post=? WHERE id=?`, [points, comments, dateNow, id]);

			response.send({
				status: 200,
				data: {
					id,
					points,
					comments,
					dateNow
				},
				message: `La votación con el id ${id} fue modificada satisfactoriamente`
			});
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
			const {
				id
			} = request.params;
			connection = await getConnection();

			const [review] = await connection.query(`SELECT id FROM reviews WHERE id=?`, [id]);

			if (!review.length) {
				return response.status(404).json({
					status: 'error',
					code: 404,
					error: `La votación de la aventura con el id ${id} no existe`
				});
			}

			await connection.query(` DELETE FROM reviews WHERE id=?`, [id]);
			response.send({
				status: 200,
				message: `La votacion con id ${id} ha sido borrada con éxito`
			});

		} catch (error) {
			next(error);
		} finally {
			if (connection) {
				connection.release();
			}
		}
	}
};

module.exports = {
	reviewsController
};