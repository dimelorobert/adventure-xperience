'use strict';

//////////////// Modules to use /////////////////////////
import 'dotenv/config.js';

import path from 'path';

import express from 'express';

import router from './routes';

import fileUpload from 'express-fileupload';

import morgan from 'morgan';

import cors from 'cors';

import './database';

const app = express();

/////////////////// MIDDLEWARES //////////////////////////
app.use(morgan('dev'));

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.use(fileUpload());

// MIDDLEWARE ERROR CONTROLLERS
// Catch the previous errors
app.use((error, request, response, next) => {
  console.log('Error from midleware :::', error);

  response.status(error.httpCode || 500).send({
    message: error.message
  });
});


// Middleware not found
app.use((request, response) => {
  response.status(404).send({
    status: 'error',
    code: 404,
    message: '❌ Ooops...Page not found, try again my friend!😢'
  });
});

//////////////// SERVER //////////////////////
// Server port config
const { DEFAULT_PORT } = process.env;

const portAssigned = DEFAULT_PORT || 3002;

app.set('port', portAssigned);

const PORT = app.get('port');

//Server launcher
app.listen(PORT, () => {
  console.log(`✅ 🔥🔥🔥 >>>> Server working on PORT ${PORT}  <<<< 🔥🔥🔥 ✅`);
});
