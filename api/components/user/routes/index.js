import routerx from "express-promise-router";
import secure from "../secure";
import validation from "../middlewares/validations";
import emailChecker from "../middlewares/emailChecker";
import userChecker from "../middlewares/userChecker";
import userRoutes from "./functions-routes";

const router = routerx();

router
	.post("/create", emailChecker, validation.createSchema, userRoutes.create)
	.get("/list", userRoutes.findAll)
	.get("/:id", userRoutes.findOne)
	.put("/:id/update", userChecker, validation.updateSchema, userRoutes.update);

/*router
		.post("/create", emailChecker, validation.createSchema, create)
		.get("/list", findAll)
		.get("/:id", findOne)
		.put("/:id/update", validation.updateSchema, update);*/
/*	.delete("/remove", remove);*/

export default router;
