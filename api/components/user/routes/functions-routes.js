import controller from "../index";
import response from "../../../../routes/response";

const userRoutes = {
	create: (req, res, next) => {
		controller
			.create(req.body)

			.then(() => {
				response.success(
					req,
					res,
					{ mesagge: "Cuenta creada con éxito" },
					201,
				);
			})
			.catch(next);
	},

	findAll: (req, res, next) => {
		controller
			.findAll()
			.then(userList => {
				response.success(req, res, { data: userList }, 200);
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
	
	update: (req, res, next) => {
		controller
			.update(req.body, req.params.id)
			.then(() => {
				response.success(req, res, { mesagge: "Datos actualizados" }, 200);
			})
			.catch(next);
	},

	remove: (req, res, next) => {
		controller
			.remove(req.params.id)
			.then(() => {
				response.success(
					req,
					res,
					{ message: "Datos borrados con éxito" },
					200,
				);
			})
			.catch(next);
	},

	activate: (req, res, next) => {
		controller
			.activate(req.params.id)
			.then(() => {
				response.success(req, res, { message: "Cuenta activada" }, 200);
			})
			.catch(next);
	},

	deactivate: (req, res, next) => {
		controller
			.deactivate(req.params.id)
			.then(() => {
				response.success(req, res, { message: "Cuenta desactivada" }, 200);
			})
			.catch(next);
	},
};

export default userRoutes;
