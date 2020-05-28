'use strict';
require('dotenv').config();

const { format } = require('date-fns');

const crypto = require('crypto');

function formatDateToDB(date) {
  return format(date, 'yyyy-MM-dd');
}

function errorGenerator(message, code) {
  const error = new Error(' ❌ ', message, '😥');
  if (code) error.httpCode = code;
  return error;
}

function randomString(size = 20) {
  return crypto.randomBytes(size).toString('hex').slice(0, size);
}

module.exports = {
  formatDateToDB,
  errorGenerator,
  randomString
};
