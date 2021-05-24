import controller from "../index";
import response from "../../../../routes/response";

const userRoutes = {
	create: (req, res, next) => {
		controller
			.create(req.body)

			.then(() => {
				response.success(req, res, "Cuenta creada con éxito", 201);
			})
			.catch(next);
	},

	update: (req, res, next) => {
		controller
			.update(req.body, req.params.id)
			.then(() => {
				response.success(req, res, "Datos actualizados", 200);
			})
			.catch(next);
	},

	findAll: (req, res, next) => {
		controller
			.findAll()
			.then(userList => {
				response.success(req, res, userList, 200);
			})
			.catch(next);
	},

	findOne: (req, res, next) => {
		controller
			.findOne(req.params.id)
			.then(user => {
				response.success(req, res, user, 200);
			})
			.catch(next);
	},

	remove: (req, res, next) => {
		controller
			.remove(req.params.id)
			.then(() => {
				response.success(req, res, "Datos borrados con éxito", 200);
			})
			.catch(next);
	},

	activate: (req, res, next) => {
		controller
			.activate(req.params.id)
			.then(() => {
				response.success(req, res, "Cuenta activada", 200);
			})
			.catch(next);
	},
};
/*
const create = (req, res, next) => {
	controller
		.create(req.body)
		.then(() => {
			return response.success(
				req,
				res,
				"Tu cuenta ha sido creada con éxito",
				201,
			);
		})
		.catch(next);
};
const update = (req, res, next) => {
	controller
		.update(req.body, req.params.id)
		.then(() => {
			return response.success(req, res, "Datos actualizados", 200);
		})
		.catch(next);
};

const findAll = (req, res, next) => {
	controller
		.findAll()
		.then(userList => {
			response.success(req, res, userList, 200);
		})
		.catch(next);
};

const findOne = (req, res, next) => {
	controller
		.findOne(req.params.id)
		.then(user => {
			response.success(req, res, user, 200);
		})
		.catch(error => {
			response.error(req, res, error.message, 500);
		});
};

const remove = (req, res, next) => {
	controller
		.remove(req.body)
		.then(user => {
			response.success(req, res, user, 200);
		})
		.catch(error => {
			response.error(req, res, error.message, 500);
		});
};*/

export default userRoutes;
