'use strict';

require('dotenv').config();

const path = require('path');
const sharp = require('sharp');
const {
  format
} = require('date-fns');
const {
  es
} = require('date-fns/locale');
const crypto = require('crypto');
const fsExtra = require('fs-extra');
const fs = require('fs').promises;
const uuid = require('uuid');

const helpers = {
  formatDateToDB: (date) => {
    return format(date, `yyyy-MM-dd HH:mm:ss`);
  },
  formatDateJSON: (date) => {
    return format(date, `yyyy-MM-dd 'T' HH:mm:ss.SSSxxx`);
  },
  formatDate4Vue: (date) => {
    return format(date, `dd 'de' MMM 'de' yyyy`, {
      locale: es
    });
  },

  errorGenerator: (message, code) => {
    const error = new Error(message);
    if (code) error.httpCode = code;
    return error;
  },

  randomString: (size = 20) => {
    return crypto.randomBytes(size).toString('hex').slice(0, size);
  },
  processAndSavePhoto: async (image) => {
    //Random generated name to save it
    const savedFileName = `${uuid.v1()}.jpg`;

    //Ensure path
    await fsExtra.ensureDir(image.path);

    //Process image
    const finalImage = sharp(image.file.data);

    //Make sure image is not wider than 500px
    const imageInfo = await finalImage.metadata();

    if (imageInfo.width > image.width && imageInfo.height > image.height) {
      finalImage.resize(image.width, image.height);
    }
    //Save image
    await finalImage.toFile(path.join(image.path, savedFileName));


    return savedFileName;
  },

  createFolder: async (pathFolderName) => {
    try {
      await fs.mkdirSync(process.cwd() + `${pathFolderName}`, {
        recursive: true
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
        recursive: true
      })
    } catch (error) {
      return error;
    }
  },
  capitalize: (word) => {
    return word[0].trim().toUpperCase() + word.slice(1);
  },
  increment: async (paramA, paramB) => await paramA * paramB,
  decrement: async (paramA, paramB) => Number(paramA) - Number(paramB)

}
module.exports = {
  helpers
};