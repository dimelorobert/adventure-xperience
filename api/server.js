import app from "./app";
import chalk from "chalk";
import config from "./config";
import logger from "../utils/helpers/logger";

// Arrow function to show logger
const serverInfo = () => {
	logger.info(
		chalk.blue(
			`🏁  Server running on ${config.api.host}:${config.api.port} 🏁`,
		),
	);
};

//Server launcher
function runServer() {
	app.listen(config.api.port, serverInfo);
}

runServer();
