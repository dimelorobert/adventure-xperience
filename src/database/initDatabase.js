"use strict";

const { dbConnection, getConnection } = require("./database");

async function main() {
  // Esperar al pool de conexiones a base de datos
  await dbConnection();

  // Referencia
  const connection = await getConnection();

  // Create tables
  //// users
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
  console.log("initial structure successfully created");
  connection.release();
}

main();
