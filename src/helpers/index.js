'use strict';

require('dotenv').config();
const path = require('path');
const sharp = require('sharp');
const { format } = require('date-fns');
const crypto = require('crypto');
const fs = require('fs-extra');
const uuid = require('uuid');





const helpers = {
  formatDateToDB: (date) => {
    return format(date, `yyyy-MM-dd HH:mm:ss`); 
  },
  formatDateJSON: (date) => {
    return format(date, `yyyy-MM-dd 'T' HH:mm:ss.SSSxxx`);
  },

  errorGenerator: (message, code) => {
    const error = new Error(message);
    if (code) error.httpCode = code;
    return error;
  },

  randomString: (size = 20) => {
    return crypto.randomBytes(size).toString('hex').slice(0, size);
  },
  processAndSavePhoto: async (pathImage,fileImage) => {
    //Random generated name to save it
    const savedFileName = `${uuid.v1()}.jpg`;

    //Ensure path
    await fs.ensureDir(pathImage);

    //Process image
    const finalImage = sharp(fileImage.data);

    //Make sure image is not wider than 500px
    const imageInfo = await finalImage.metadata();

    if (imageInfo.width > 500 && imageInfo.height > 350) {
      finalImage.resize(500,350);
    }
    //Save image
    await finalImage.toFile(path.join(pathImage, savedFileName));
  

    return savedFileName;
  },
  deletePhoto: async (pathImage,fileImage) => {
    await fs.unlink(path.join(pathImage,fileImage));
  }
  
};

module.exports = {
  helpers
};
