'use strict';

const { getConnection } = require('./database');
const { formatDateToDB } = require('./helpers/');

async function main() {
  try {
    const connection = await getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user ( 
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(35) NOT NULL ,
        surname VARCHAR(35) NOT NULL , 
        date_birth DATE NOT NULL ,
        country VARCHAR(60) NOT NULL ,
        city VARCHAR(60) NOT NULL , 
        email VARCHAR(100) NOT NULL ,
        telephone VARCHAR(20),
        password VARCHAR(16) NOT NULL , 
        avatar VARCHAR(120) ,
        creating_date DATETIME NOT NULL,
        updating_date DATETIME NOT NULL,
        ip VARCHAR(20) NOT NULL , 
        PRIMARY KEY(id)
      );
    `);
    console.log('Creada la tabla user');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS category ( 
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(35) NOT NULL ,
        description VARCHAR(500) ,
        image VARCHAR(120) ,
        date_creation DATETIME NOT NULL,
        PRIMARY KEY(id)
      );
    `);
    console.log('Creada la tabla category');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS adventure ( 
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(35) NOT NULL ,
        description VARCHAR(500) ,
        image VARCHAR(120) ,
        price FLOAT DEFAULT 0,  
        city VARCHAR(60) NOT NULL ,
        vacancy INT NOT NULL DEFAULT 6, 
        date_select DATETIME NOT NULL,
        PRIMARY KEY(id)
        );
    `);
    console.log('tabla adventures creada');
    await connection.query(`
    INSERT INTO adventure(
      name, description, image, price, city, vacancy, date_select) 
      VALUES('Paracaidismo', 'Excursion Paracaidas en grupo', 'https://img.com/img.jpg',50.95, 'Valencia', 5, 
      '${formatDateToDB(new Date())}
    ');
  `);
    console.log('insercion de datos tabla adventures');
    console.log('Base de datos funcionando correctamente');
    connection.release();
  } catch (error) {
    console.error(error);
  }
}

main();
