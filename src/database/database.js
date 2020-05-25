"use strict";

// Modulos a usar
const mysql = require("mysql2/promise");
require("dotenv").config();
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
let pool;
// Conectarse a la base de datos
async function dbConnection() {
  pool = mysql.createPool({
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
  });
  try {
    // Testea si la conexion es recibida  y despues ...
    const testConnection = await pool.getConnection();
    // Cierra conexion
    testConnection.release();
  } catch (error) {
    console.error(error.message);
  }
}

// Obtener pool de conexiones
async function getConnection() {
  if (!pool) {
    throw new Error("Mysql not connected");
  }
  return await pool.getConnection();
}

module.exports = { dbConnection, getConnection };
