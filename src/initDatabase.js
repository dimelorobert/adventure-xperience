"use strict";

const { dbConnection, getConnection } = require("./database.js");

async function main() {
  // Esperar conexion base de datos
  await dbConnection();

  // Referencia
  const connection = await getConnection();

  // Create table
  await connection.query(`
  CREATE TABLE IF NOT EXISTS user(
    id INT NOT NULL AUTO_INCREMENT, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    country VARCHAR(100) NOT NULL, 
    city VARCHAR(100) NOT NULL, 
    PRIMARY KEY(id)
  )
  `);
  console.log("initial structure created");
  connection.release();
}

main();
