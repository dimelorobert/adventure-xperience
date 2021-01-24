"use strict";

import path from "path";

import express from "express";

import router from "./routes";

import fileUpload from "express-fileupload";

import morgan from "morgan";

import cors from "cors";

import { notFoundErrorHandler, previousErrorHandler } from "./middlewares";

import "./database";

const app = express();

/////////////////// MIDDLEWARES //////////////////////////
app  
  .use(morgan("dev"))

  .use(cors())
  
  .use(fileUpload())

  .use(express.json())

  .use(express.urlencoded({ extended: false }))

  .use(express.static(path.join(__dirname, "public")))

  .use("/", router)

  

  // MIDDLEWARE ERRORHANDLERS
  // Catch the previous errors
  .use(previousErrorHandler)

  // Middleware not found
  .use(notFoundErrorHandler);

export default app;
