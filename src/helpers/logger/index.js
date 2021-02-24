import chalk from "chalk";
import path from "path";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import checkFileExist from "./functionsLogger";

const { ERROR_PATH_LOGS } = process.env;
const dateNow = new Date();
const formatedDate = format(dateNow, "yyyy-MM-d", { locale: es });
const fileName = `${formatedDate}-errors.log`;
const locationErrorLog = path.join(
	__dirname,
	`../../${ERROR_PATH_LOGS}`,
	`./${fileName}`,
);

const logger = {
	error: msg => {
		console.log(chalk.black.bgRed("[ ERROR ] :"), chalk.red(msg));
		checkFileExist(msg);
	},
	warning: msg => {
		console.log(chalk.black.bgYellow("[ WARNING ] :"), chalk.yellow(msg));
		checkFileExist(locationErrorLog, msg);
		console.log(locationErrorLog);
	},
	info: msg => {
		console.log(chalk.black.bgBlue("[ INFO ] :"), chalk.blue(msg));
	},
	success: msg => {
		console.log(chalk.black.bgGreen("[ SUCCESS ] :"), chalk.green(msg));
	},
};

export default logger;
