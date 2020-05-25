"use strict";

//////////////// Modulos a usar /////////////////////////
require("dotenv").config();
const express = require("express");

const app = express();

// Configuracion puertos server
const { PORT } = process.env;
const portAssigned = PORT;
app.set("port", portAssigned || 3002);
const port = app.get("port");

// Database
const { dbConnection } = require("./database/database");
/////////////////// APP USES //////////////////////////
app.use(require("./routes/adventureRoutes"));
app.use(require("./middlewares"));

//////////////// SERVER //////////////////////
// Se lanza servidor y se Conecta a la data baseal mismo tiempo
// De esta forma garantizamos que cuando el servidor comienza a escuchar ya haya una conexion a la base de datos
async function main() {
  await dbConnection();
  // lanzar servidor
  app.listen(port, () => {
    console.log(`✔️ 🚀 >>>> Server working on PORT ${port}  <<<< 🚀 ✔️`);
  });
}
main();
