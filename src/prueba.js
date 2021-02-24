require("dotenv").config({ path: "../.env" });
const { ERROR_PATH_LOGS } = process.env;
const fs = require("fs");
const { format } = require("date-fns");
const { es } = require("date-fns/locale");
const dateNow = new Date();
const path = require("path");
const formatedDate = format(dateNow, "yyyy-MM-d", { locale: es });
const formatedHour = format(dateNow, `yyyy-MM-d HH:mm:ss`, { locale: es });
//console.log(formatedDate);
const fileName = `${formatedDate}-errors.log`;
const locationErrorLog = path.join(
	__dirname,
	`./${ERROR_PATH_LOGS}`,
	`./${fileName}`,
);

//console.log(path.parse(locationErrorLog));

//console.log(path);

///////////crear archivo

function createFile(pathFile, info) {
	const condition = error => {
		if (error) {
			console.log("Archivo creado");
		}
	};
	fs.writeFile(pathFile, info, condition);
}
// createFile(locationErrorLog, "catredoblehijueputa");

function addTextFile(pathFile, info) {
	const condition = error => {
		if (error) {
			console.log("Texto Añadido");
		}
	};
	fs.appendFile(pathFile, info, condition);
}

function deleteFile(pathFile) {
	fs.unlink(pathFile, error => {
		if (!error) {
			console.log("El archivo se borro correctamente");
		} else {
			console.log("El archivo no se ha podido borrar");
		}
	});
}
function checkFileSize(pathFile, info) {
	fs.stat(pathFile, (error, stats) => {
		console.log("EL SIZE FILE NEBE", stats.size);
		if (!error && stats.size >= 100) {
			deleteFile(pathFile);
		}
	});
}

function checkFileExist(pathFile, info = "") {
	const conditionExist = error => {
		if (error) {
			console.log("El archivo no existe");
			createFile(pathFile, `${formatedHour} - ${info}\n`);
		} else {
			checkFileSize(pathFile, info);
			addTextFile(pathFile, `${formatedHour} - ${info}\n`);
			console.log("ya existe");
		}
	};

	fs.access(pathFile, fs.F_OK, conditionExist);
}
checkFileExist(locationErrorLog, "hola");

//addTextFile(locationErrorLog, " re marica catredoblehijueputa");

/*

function checkFileSize(pathFile) {
	fs.stat(pathFile, (error, stats) => {
		const fileSize = stats.size;
		const fiveMegas = 50;
		const overageFileSize = fileSize >= fiveMegas;
		const newFile = pathFile;
		console.log("EL SIZE FILE NEBE", stats.size);
		overageFileSize ? createFile(newFile, "Log Errors") : false;
	});
}

////////////// capitalize

const capitalize = string => {
	let splitString = string.toLowerCase().split(" ");

	for (let i = 0; i < splitString.length; i++) {
		splitString[i] =
			splitString[i].charAt(0).toUpperCase() + splitString[i].substring(1);
	}

	return splitString.join(" ");
};

console.log(capitalize("robert hernández"));

const chalk = require("chalk");

const logger = {
	error: msg => {
		console.log(chalk.black.bgRed("[ ERROR ] :"), chalk.red(msg));
	},
	warning: msg => {
		console.log(chalk.black.bgYellow("[ WARNING ] :"), chalk.yellow(msg));
	},
	info: msg => {
		console.log(chalk.black.bgBlue("[ INFO ] :"), chalk.blue(msg));
	},
	success: msg => {
		console.log(chalk.black.bgGreen("[ SUCCESS ] :"), chalk.green(msg));
	},
};

logger.error("error de la puta ostia");
logger.warning("warning de la puta ostia");
logger.info("info de la puta ostia");
logger.success("EXITO de la puta ostia");*/
