'use strict';

//////////////// Modulos a usar /////////////////////////
require('dotenv').config();
const path = require('path');
const express = require('express');
const router = require('./routes');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(morgan('dev'));
app.use(cors());

/////////////////// MIDDLEWARES //////////////////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(fileUpload());
app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));


// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});



// MIDDLEWARE CONTROLADOR DE ERRORES
//Errores previos a Middleware llegan aqui
app.use((error, request, response, next) => {
  console.log(error);
  response.status(error.httpCode || 500).send({
    message: error.message
  });
});

// Middleware not found
app.use((request, response) => {
  response.status(404).send({
    status: 'error',
    code: 404,
    message: '❌ Ooops...Pagina no encontrada!😢'
  });
});

//////////////// SERVER //////////////////////
// Configuracion puertos server
const {
  PORT
} = process.env;
const portAssigned = PORT;
app.set('port', portAssigned || 3002);
const port = app.get('port');
app.listen(port, () => {
  console.log(`✔️ 🚀 >>>> Server working on PORT ${port}  <<<< 🚀 ✔️`);
});