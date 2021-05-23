import routerx from "express-promise-router";
import secure from "../secure";
import validation from "../middlewares/validations";
import userChecker from "../middlewares/userChecker";
import userRoutes from "./functions-routes";

const router = routerx();

router
	.post("/create", userChecker, validation.createSchema, userRoutes.create)
	.get("/list", userRoutes.findAll)
	.get("/:id", userChecker, userRoutes.findOne)
	.put("/:id/update", userChecker, validation.updateSchema, userRoutes.update)
	.delete("/:id/delete", userChecker, userRoutes.remove);

/*router
		.post("/create", emailChecker, validation.createSchema, create)
		.get("/list", findAll)
		.get("/:id", findOne)
		.put("/:id/update", validation.updateSchema, update);*/
/*	.delete("/remove", remove);*/

export default router;
