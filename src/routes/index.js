import routerx from "express-promise-router";
import usersRouter from "../api/users/routes";
import { errorHandler } from "../middlewares";

const router = routerx();

router
	.use("/users", usersRouter)
	.use(errorHandler.not_found)
	.use(errorHandler.previous);

export default router;
