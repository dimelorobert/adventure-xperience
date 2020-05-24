"use strict";

//////////////// Modulos a usar /////////////////////////
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
app.set("port", process.env.PORT || 3002);
const port = app.get("port");
// controllers
const {
  adventureList,
  newAdventure,
  deleteAdventure,
} = require("./controllers");
// Database
const { connectDb } = require("./database");
/////////////////// ROUTES //////////////////////////
app.get("/adventures", adventureList);
app.post("/adventures", newAdventure);
app.delete("/adventures/:id", deleteAdventure);

//////////////// MIDDLEWARES //////////////////////////
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

// Body Parser transforma el json que recibe en estructura de peticion automaticamente
app.use(bodyParser.json());

//////////////// SERVER //////////////////////
// Se lanza servidor y se Conecta a la data baseal mismo tiempo
// De esta forma garantizamos que cuando el cliente haga una peticion ya haya una conexion a la base de datos
async function mainConectDb() {
  try {
    await connectDb();
  } catch (error) {
    console.log(
      "error al intentar crear la conexion con la base de datos",
      error
    );
  } finally {
    // lanzar servidor
    app.listen(port, () => {
      console.log(`✔️ 🚀 >>>> Server working on PORT ${port}  <<<< 🚀 ✔️`);
    });
  }
}
mainConectDb();
