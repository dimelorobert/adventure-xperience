'use strict';

const { getConnection } = require('./database');

async function main() {
  try {
    const connection = await getConnection();

    await connection.query(`CREATE TABLE IF NOT EXISTS user ( 
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(30) NOT NULL,
      surname VARCHAR(60) NOT NULL, 
      date_birth DATE NOT NULL,
      country VARCHAR(30),
      city VARCHAR(30), 
      nickname VARCHAR(20) NOT NULL UNIQUE, 
      email VARCHAR(60) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL, 
      avatar VARCHAR(60),
      creation_date TIMESTAMP,
      PRIMARY KEY
    `);
    console.log('Creada la tabla user');

    await connection.query(`CREATE TABLE IF NOT EXISTS category ( 
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(60) NOT NULL UNIQUE,
      image VARCHAR(120),
      creation_date DATETIME,
      modify_date DATETIME,
      PRIMARY KEY(id));
    `);
    console.log('Creada la tabla category');

    
    console.log('Creada la tabla invoice');
    console.log('Estructura de base de datos creada exitosamente');
    console.log('Base de datos funcionando correctamente');
    
  } catch (error) {
    console.error(error);
  } finally {
    if(connection) {
      connection.release();
    }
  }
}

main();
