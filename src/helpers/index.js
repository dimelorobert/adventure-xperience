"use strict";

require("dotenv").config();

import path from "path";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import crypto from "crypto";
import sharp from "sharp";
import { v1 as uuidv1 } from "uuid";
import fsExtra from "fs-extra";

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
  processAndSavePhoto: async (uploadedImage) => {
    // Random File name to be saved
    const savedFileName = `${uuidv1()}.jpg`;

    // Ensure the uploads path exists
    await fsExtra.ensureDir(uploadedImage.path);

    // Process image
    const finalImage = sharp(uploadedImage.file.data);

    //Make sure image is not wider than 500px
    let imageInfo = await finalImage.metadata();

    if (
      imageInfo.width > uploadedImage.width &&
      imageInfo.height > uploadedImage.height
    ) {
      finalImage.resize(uploadedImage.width, uploadedImage.height);
    }

    // Save image
    await finalImage.toFile(path.join(uploadedImage.path, savedFileName));

    return savedFileName;
  },

  renameFolder: async (oldPathDirName, newPathDirName) => {
    try {
      await fs.renameSync(oldPathDirName, newPathDirName);
    } catch (error) {
      return error;
    }
  },
  deletePhoto: async (pathImage, fileImage) => {
    try {
      await fs.unlink(path.join(pathImage, fileImage));
    } catch (error) {
      return console.log(error);
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
