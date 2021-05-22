/*import chalk from "chalk";
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
		checkFileExist(locationErrorLog, msg);
	},
	warning: msg => {
		console.log(chalk.black.bgYellow("[ WARNING ] :"), chalk.yellow(msg));
		checkFileExist(locationErrorLog, msg);
	
	},
	info: msg => {
		console.log(chalk.black.bgBlue("[ INFO ] :"), chalk.blue(msg));
	},
	success: msg => {
		console.log(chalk.black.bgGreen("[ OK ] :"), chalk.green(msg));
	},
};*/
import winston from "winston";
import path from "path";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const dateNow = new Date();
const formatedDate = format(dateNow, "yyyy-MM-d", { locale: es });
const timeStampLog = format(dateNow, "yyyy-MM-d HH:mm:ss", { locale: es });
const fileName = `${formatedDate}-application-logs.log`;
const logPath = path.join(__dirname, `../../../logs/${fileName}`);
const addDate = winston.format(info => {
	info.message = `${timeStampLog} ${info.message}`;
	return info;
});

const myCustomLevels = {
	levels: {
		info: 0,
		verbose: 1,
		warn: 2,
		error: 3,
	},
	colors: {
		info: "black blueBG",
		verbose: "green",
		warn: "black yellowBG",
		error: "black redBG",
	},
};
winston.addColors(myCustomLevels.colors);
const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			levels: myCustomLevels.levels,
			handleExceptions: true,
			format: winston.format.combine(
				winston.format.colorize(myCustomLevels.colors),
				winston.format.simple(),
			),
		}),
		new winston.transports.File({
			level: "info",
			handleExceptions: true,
			format: winston.format.combine(addDate(), winston.format.simple()),
			maxsize: 5120000, // 5mb
			maxFiles: 5,
			filename: logPath,
		}),
	],
});

export default logger;
