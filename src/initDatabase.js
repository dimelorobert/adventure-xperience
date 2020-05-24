"use strict";

const { connectDb, getConnection } = require("./database");

async function main() {
  // Esperar conexion base de datos
  await connectDB();

  // Referencia
  const connection = await getConnection();

  // Create table
  await connection.query(`
  CREATE TABLE IF NOT EXISTS user(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    country VARCHAR(100) NOT NULL, 
    city VARCHAR(100) NOT NULL, 
  )
  `);
  console.log("initial structure created");
  connection.release();
}

main();
