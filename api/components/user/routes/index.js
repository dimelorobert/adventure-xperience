import routerx from "express-promise-router";
import middlewares from "../middlewares";
import userRoutes from "./functions-routes";

const router = routerx();

router
	.post(
		"/create",
		middlewares.checkIfEmailExists,
		middlewares.validation.create,
		userRoutes.create,
	)

	.post(
		"/new-activation-code",
		middlewares.checkIfUserNotExists,
		middlewares.checkIfAccountIsActivated,
		middlewares.checkIfThereIsActivationCode,
		userRoutes.newCode,
	)

	.get("/list", userRoutes.findAll)

	.get("/:id", middlewares.checkIfUserNotExists, userRoutes.findOne)

	.get(
		"/:id/activate",
		middlewares.checkIfUserNotExists,
		middlewares.checkIfAccountIsActivated,
		middlewares.checkIfActivationCodeAreTheSame,
		userRoutes.activate,
	)

	.get(
		"/:id/deactivate",
		middlewares.checkIfUserNotExists,
		middlewares.checkIfAccountIsDeactivated,
		userRoutes.deactivate,
	)

	.put(
		"/:id/update",
		middlewares.checkIfUserNotExists,
		middlewares.validation.update,
		userRoutes.update,
	)

	.delete("/:id/delete", middlewares.checkIfUserNotExists, userRoutes.remove);

export default router;
