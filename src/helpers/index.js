'use strict';

require('dotenv').config();
const path = require('path');
const sharp = require('sharp');
const { format } = require('date-fns');
const crypto = require('crypto');
const fs = require('fs-extra');
const uuid = require('uuid');
const imageUploadPath = path.join(__dirname, `../${process.env.UPLOADS_DIR}`);
// const os = require('os');
// const ifaces = os.networkInterfaces();

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
  processAndSavePhoto: async (uploadedImage) => {
    //Random generated name to save it
    const savedFileName = `${uuid.v1()}.jpg`;

    //Ensure path
    await fs.ensureDir(imageUploadPath);

    //Process image
    const finalImage = sharp(uploadedImage.data);

    //Make sure image is not wider than 500px
    const imageInfo = await finalImage.metadata();

    if (imageInfo.width > 500) {
      finalImage.resize(500);
    }
    //Save image
    await finalImage.toFile(path.join(imageUploadPath, savedFileName));

    return savedFileName;
  }
  // getIP: () => {
  //   const ifaces = os.networkInterfaces();
  //   Object.keys(ifaces).forEach(function (ifname) {
  //     let alias = 0;
  //     ifaces[ifname].forEach(function (iface) {
  //       if ('IPv4' !== iface.family || iface.internal !== false) {
  //         return;
  //       }

  //       if (alias >= 1) {
  //         console.log(ifname + ':' + alias, iface.address);
  //       } else {
  //         console.log(iface.address);
  //       }
  //       ++alias;
  //     });
  //   });
  // }
};

module.exports = {
  helpers
};
