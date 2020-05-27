'use strict';

//////////////// Modulos a usar /////////////////////////
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// Configuracion puertos server
const { PORT } = process.env;
const portAssigned = PORT;
app.set('port', portAssigned || 3002);
const port = app.get('port');

// Database

/////////////////// CONTROLLERS //////////////////////////
// Adventures
const { adventureController } = require('./controllers/adventures');
/////////////////// ROUTES //////////////////////////
// Adventures
app.get('/adventures', adventureController.lista);
app.post('/adventures', adventureController.crea);
app.delete('/adventures/:id', adventureController.borra);
// Console.log middleware
app.use(morgan('dev'));

/////////////////// MIDDLEWARES //////////////////////////
// Errores previos a Middleware llegan aqui || CONTROLADOR DE ERRORES
app.use((error, request, response, next) => {
  console.log(error);
  response.status(error.httpCode || 500).send({ message: error.message });
});

// Middleware not found
app.use((request, response) => {
  response.status(404).send({ message: '❌ Page not found!😢' });
});
module.exports = app;

// Body Parser transforma el json que recibe en estructura de peticion automaticamente
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//////////////// SERVER //////////////////////
// Se lanza servidor y se Conecta a la data baseal mismo tiempo
// De esta forma garantizamos que cuando el servidor comienza a escuchar ya haya una conexion a la base de datos

// lanzar servidor
app.listen(port, () => {
  console.log(`✔️ 🚀 >>>> Server working on PORT ${port}  <<<< 🚀 ✔️`);
});
