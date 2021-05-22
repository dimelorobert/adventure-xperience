import authRouter from "../api/components/authentication/routes";
import emailRouter from "../api/components/mail/routes";
import errorHandler from "./errorHandler";
import routerx from "express-promise-router";
import swaggerUI from "swagger-ui-express";
import swaggerDOC from "../utils/docs/swagger.json";
import userRouter from "../api/components/user/routes";

const options = {
	customCss: ".swagger-ui .topbar { display: none } ",
};
const router = routerx();

router

	.use("/user", userRouter)

	.use("/auth", authRouter)

	.use("/email", emailRouter)

	.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDOC, options))

	.use(errorHandler.previous)

	.use(errorHandler.notFound);

export default router;
