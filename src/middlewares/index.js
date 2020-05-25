"use strict";

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

//////////////// APP //////////////////////
const app = express();

// Console.log middleware
app.use(morgan("dev"));

// Error Middleware CONTROLADOR DE ERRORES
app.use((error, request, response, next) => {
  console.log(error);
  response.status(error.httpCode || 500).send({ message: error.message });
});

// Middleware not found
app.use((request, response) => {
  response.status(404).send({ message: "❌ Page not found!😢" });
});
module.exports = app;

// Body Parser transforma el json que recibe en estructura de peticion automaticamente
app.use(bodyParser.json());
