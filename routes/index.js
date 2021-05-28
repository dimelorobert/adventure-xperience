import authRouter from "../api/components/authentication/routes";
import emailRouter from "../api/components/mail/routes";
import errorHandler from "./errorHandler";
import routerx from "express-promise-router";
import swaggerUI from "swagger-ui-express";
import swaggerDOC from "../utils/docs/swagger.json";
import userRouter from "../api/components/user/routes";
import config from "../api/config";
const Vonage = require("@vonage/server-sdk");
const vonage = new Vonage({
	apiKey: "a4693ada",
	apiSecret: "CYvcwXhlDak0rE77",
});

const options = {
	customCss: ".swagger-ui .topbar { display: none } ",
};
const router = routerx();

router

	.use(`/${config.api.routes.user}`, userRouter)
	.post("/sms", (req, res, next) => {
		const from = "Vonage APIs";
		const to = "34675389333";
		const text = req.body.message;

		vonage.message.sendSms(from, to, text, (err, responseData) => {
			if (err) {
				console.log(err);
			} else {
				if (responseData.messages[0]["status"] === "0") {
					console.log("Message sent successfully.");
				} else {
					console.log(
						`Message failed with error: ${responseData.messages[0]["error-text"]}`,
					);
				}
			}
			res.status(200).json({ message: "Mensaje enviado con éxito" });
		});
	})

	.use("/auth", authRouter)

	.use("/email", emailRouter)

	.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDOC, options))

	.use(errorHandler.previous)

	.use(errorHandler.notFound);

export default router;
