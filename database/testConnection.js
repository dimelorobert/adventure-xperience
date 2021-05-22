import chalk from "chalk";
import logger from "../../../utils/helpers/logger";
import mysql2 from "mysql2";

// iife to testing connection
function testConnectionDB() {
	pool = mysql2.createConnection(config.mysql);
	pool.connect(error => {
		if (error) {
			logger.error(chalk.red("[DB Error]", error));
			setTimeout(() => getConnection, 2000);
		} else {
			logger.info(
				chalk.blue(
					`🐬  The connection to DB it's ${chalk.green("OK")}  🐬`,
				),
			);
		}
	});
}

export default testConnectionDB;
