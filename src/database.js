"use strict";

// Modulos a usar
const mysql = require("mysql2/promise");
require("dotenv").config();
const { USER_DB, PASSWORD_DB, DATABASE, HOST } = process.env;
let pool;

// Conectarse a la base de datos
async function connectDb() {
  // Creamos el pool para la conexion y almacenamos su valor
  pool = mysql.createPool({
    connectionLimit: 10,
    host: HOST,
    user: USER_DB,
    password: PASSWORD_DB,
    database: DATABASE,
  });
  // Testea si la conexion es recibida  y despues ...
  const testConnection = await pool.getConnection();
  // Cierra conexion
  testConnection.release();
}

// Obtener pool de conexiones
async function getConnection() {
  if (!pool) {
    throw new Error("Mysql not connected");
  }
  return await pool.getConnection();
}

module.exports = { connectDb, getConnection };
