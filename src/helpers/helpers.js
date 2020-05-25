"use strict";

// Modulos a usar
const { format } = require("date-fns");

// Fecha en formato database
function getDateDBformat() {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

module.exports = {
  getDateDBformat,
};
