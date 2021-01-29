import { format } from "date-fns";
import { es } from "date-fns/locale";
import crypto from "crypto";

const fs = require("fs").promises;

const helpers = {
  formatDateToDB: (date) => {
    return format(date, `yyyy-MM-dd HH:mm:ss`);
  },
  formatDateJSON: (date) => {
    return format(date, `yyyy-MM-dd 'T' HH:mm:ss.SSSxxx`);
  },
  formatDate4Vue: (date) => {
    return format(date, `dd 'de' MMM 'de' yyyy`, {
      locale: es,
    });
  },

  errorGenerator: (message, code) => {
    const error = new Error(message);
    if (code) error.httpCode = code;
    return error;
  },

  randomString: (size = 20) => {
    return crypto.randomBytes(size).toString("hex").slice(0, size);
  },

  createFolder: async (pathFolderName) => {
    try {
      await fs.mkdirSync(process.cwd() + `${pathFolderName}`, {
        recursive: true,
      });
      console.log(`Directorio creado con exito`);
    } catch (error) {
      return error;
    }
  },

  renameFolder: async (oldPathDirName, newPathDirName) => {
    try {
      await fs.renameSync(oldPathDirName, newPathDirName);
    } catch (error) {
      return error;
    }
  },
  deleteFile: async (pathFile) => {
    try {
      await fs.unlink(pathFile);
    } catch (error) {
      return error;
    }
  },

  deleteFolder: async (pathFolder) => {
    try {
      await fs.rmdir(`${pathFolder}`, {
        recursive: true,
      });
    } catch (error) {
      return error;
    }
  },
  capitalize: (word) => {
    return word[0].trim().toUpperCase() + word.slice(1);
  },
  increment: async (paramA, paramB) => (await paramA) * paramB,
  decrement: async (paramA, paramB) => Number(paramA) - Number(paramB),
};
export default helpers;
