'use strict';

//////////////// Modulos a usar /////////////////////////

import path from 'path';

import express from 'express';

import consign from 'consign';

import router from './routes';

import fileUpload from 'express-fileupload';

import morgan from 'morgan';

import cors from 'cors';

const app = express();

consign({
  cdw: __dirname
})
  .include(`./src/libs//middlewares.js`)
  .then(`./routes`)
  .then(`./src/libs/boot.js`)
  .into(app);

/////////////////// MIDDLEWARES //////////////////////////
app.use(morgan('dev'));

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.use(fileUpload());

// MIDDLEWARE CONTROLADOR DE ERRORES
//Errores previos a Middleware llegan aqui
app.use((error, request, response, next) => {
  console.log('Error desde el middleware:::', error);

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
