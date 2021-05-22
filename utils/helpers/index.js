import { format } from "date-fns";
import { es } from "date-fns/locale";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const helpers = {
	formatDateToDB: date => {
		return format(date, `yyyy-MM-dd HH:mm:ss`);
	},
	formatDateJSON: date => {
		return format(date, `yyyy-MM-dd 'T' HH:mm:ss.SSSxxx`);
	},
	formatDate4Vue: date => {
		return format(date, `dd 'de' MMM 'de' yyyy HH:mm:ss`, {
			locale: es,
		});
	},

	errorGenerator: (message, code) => {
		const error = new Error(message);
		if (code) error.statusCode = code;
		return error;
	},

	randomString: (size = 20) => {
		return crypto.randomBytes(size).toString("hex").slice(0, size);
	},

	createFolder: pathFolderName => {
		try {
			fs.mkdirSync(process.cwd() + `${pathFolderName}`, {
				recursive: true,
			});
			console.log(`Directorio creado con exito`);
		} catch (error) {
			return error;
		}
	},

	renameFolder: (oldPathDirName, newPathDirName) => {
		try {
			fs.renameSync(oldPathDirName, newPathDirName);
		} catch (error) {
			return error;
		}
	},

	deleteFolder: pathFolder => {
		try {
			fs.rmdir(`${pathFolder}`, {
				recursive: true,
			});
		} catch (error) {
			return error;
		}
	},
	capitalize: string => {
		let splitString = string.toLowerCase().split(" ");

		for (let i = 0; i < splitString.length; i++) {
			splitString[i] =
				splitString[i].charAt(0).toUpperCase() +
				splitString[i].substring(1);
		}

		return splitString.join(" ");
	},
	getPathFile: nameFile => {
		let pathFile = path.join(__dirname, nameFile);
		return pathFile;
	},

	createFile: (pathFile, info) => {
		const condition = error => {
			if (error) {
				console.log("Archivo creado");
			}
		};
		fs.writeFile(pathFile, info, condition);
	},
	addTextFile: (pathFile, info) => {
		const condition = error => {
			if (error) {
				console.log("Texto Añadido");
			}
		};
		fs.appendFile(pathFile, info, condition);
	},

	deleteFile: pathFile => {
		fs.unlink(pathFile, error => {
			if (!error) {
				console.log("El archivo se borro correctamente");
			} else {
				console.log("El archivo no se ha podido borrar");
			}
		});
	},
	checkFileSize: (pathFile, info) => {
		fs.stat(pathFile, (error, stats) => {
			//console.log(`Peso en bytes del archivo ${stats.size} bytes`);
			if (!error && stats.size >= 5242880) {
				helpers.deleteFile(pathFile);
			}
		});
	},
	multipleColumnSet: object => {
		if (typeof object !== "object") {
			throw new Error("Invalid input");
		}

		const keys = Object.keys(object);
		const values = Object.values(object);

		let columnSet = keys.map(key => `${key} = ?`).join(", ");

		return {
			columnSet,
			values,
		};
	},
};
export default helpers;
