import app from "./app.js";
import logger from "./helpers/logger";
import "dotenv/config";
function main() {
	// Server port config
	const { FIRST_DEFAULT_PORT, SECOND_DEFAULT_PORT, PUBLIC_HOST } = process.env;
	const portAssigned = FIRST_DEFAULT_PORT || SECOND_DEFAULT_PORT;
	app.set("port", portAssigned);
	const PORT = app.get("port");

	//Server launcher
	app.listen(PORT, () => {
		try {
			logger.info(`>>>> Server running on ${PUBLIC_HOST}:${PORT}  <<<< `);
		} catch (error) {
			logger.error("Server out of service", error);
		}
	});
}

main();
