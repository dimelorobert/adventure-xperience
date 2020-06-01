'use strict';

//////////////// Modulos a usar /////////////////////////
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
// Console.log middleware
app.use(morgan('dev'));
// Body Parser transforma el json que recibe en estructura de peticion automaticamente
//app.use(bodyParser.urlencoded({ extended: false }));
/////////////////// MIDDLEWARES //////////////////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/////////////////// CONTROLLERS //////////////////////////
// Adventures
const { adventureController } = require('./controllers');
/////////////////// ROUTES //////////////////////////
// Adventures
app.get('/adventures', adventureController.list);
app.post('/adventures', adventureController.create);
app.delete('/adventures/:id', adventureController.delete);

// MIDDLEWARE CONTROLADOR DE ERRORES
//Errores previos a Middleware llegan aqui
app.use((error, request, response, next) => {
  console.log(error);
  response.status(error.httpCode || 500).send({ message: error.message });
});

// Middleware not found
app.use((request, response) => {
  response.status(404).send({ message: '❌ Page not found!😢' });
});

//////////////// SERVER //////////////////////
// Configuracion puertos server
const { PORT } = process.env;
const portAssigned = PORT;
app.set('port', portAssigned || 3002);
const port = app.get('port');
app.listen(port, () => {
  console.log(`✔️ 🚀 >>>> Server working on PORT ${port}  <<<< 🚀 ✔️`);
});
