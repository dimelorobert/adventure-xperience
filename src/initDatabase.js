'use strict';

const { getConnection } = require('./database');
const { formatDateToDB } = require('./helpers/');

async function main() {
  try {
    const connection = await getConnection();

    await connection.query(`CREATE TABLE IF NOT EXISTS user ( 
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(60) NOT NULL ,
        surname VARCHAR(60) NOT NULL , 
        date_birth DATE NOT NULL ,
        address VARCHAR(60),
        country VARCHAR(60) NOT NULL ,
        city VARCHAR(60) NOT NULL , 
        email VARCHAR(60) NOT NULL ,
        nick VARCHAR(20) , 
        password VARCHAR(16) NOT NULL , 
        avatar VARCHAR(120) ,
        creating_date DATETIME NOT NULL,
        updating_date DATETIME NOT NULL,
        ip VARCHAR(20) NOT NULL , 
        PRIMARY KEY(id)
      );
    `);
    console.log('Creada la tabla user');

    await connection.query(`CREATE TABLE IF NOT EXISTS category ( 
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(35) NOT NULL ,
        description VARCHAR(500) ,
        image VARCHAR(120) ,
        user_id INT UNSIGNED ,  
        FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
        PRIMARY KEY(id , user_id)
      );
    `);
    console.log('Creada la tabla category');
    await connection.query(`CREATE TABLE IF NOT EXISTS adventures ( 
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(35) NOT NULL ,
        description VARCHAR(500) ,
        image VARCHAR(120) ,
        price FLOAT DEFAULT 0,  
        city VARCHAR(60) NOT NULL ,
        vacancy INT NOT NULL DEFAULT 6, 
        date_select DATETIME NOT NULL,
        user_id INT UNSIGNED , 
        category_id INT UNSIGNED , 
        FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
        FOREIGN KEY fk_category_id (category_id) REFERENCES category(id) , 
        PRIMARY KEY(id, user_id, category_id)
    `);
    console.log('tabla adventures creada');

    await connection.query(`CREATE TABLE IF NOT EXISTS cart ( 
      id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
      checkout_date DATETIME NOT NULL,
      purchase_date DATETIME NOT NULL,
      total_price FLOAT DEFAULT 0, 
      user_id INT UNSIGNED ,
      adventure_id INT UNSIGNED ,   
      FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
      FOREIGN KEY adventure_id (adventure_id) REFERENCES adventures(id) ,
      PRIMARY KEY (id , user_id, adventure_id)
      );
    `);
    console.log('Tabla cart creada');
    await connection.wuery(`CREATE TABLE IF NOT EXISTS chat ( 
      id INT UNSIGNED NOT NULL AUTO_INCREMENT ,
      message VARCHAR(500) , 
      date_post DATETIME , 
      user_id INT UNSIGNED ,
      FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
      PRIMARY KEY (id)
      );
    `);
    console.log('tabla chat creada');

    await connection.query(`CREATE TABLE IF NOT EXISTS review ( 
      id INT UNSIGNED NOT NULL AUTO_INCREMENT ,
      points VARCHAR(35) NOT NULL ,
      comments VARCHAR(500) ,
      date_post DATETIME NOT NULL , 
      user_id INT UNSIGNED ,
      adventure_id INT UNSIGNED ,   
      FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
      FOREIGN KEY adventure_id (adventure_id) REFERENCES adventures(id) ,
      PRIMARY KEY (id)
      );
    `);
    console.log('tabla review creada');

    await connection.query(`CREATE TABLE IF NOT EXISTS invoice ( 
      id INT UNSIGNED NOT NULL AUTO_INCREMENT ,
      name VARCHAR(60) NOT NULL ,
      surname VARCHAR(60) NOT NULL ,  
      dni VARCHAR(20),
      address VARCHAR(60) NOT NULL ,
      zipcode VARCHAR(20) ,
      country VARCHAR(60) NOT NULL ,
      city VARCHAR(60) NOT NULL , 
      email VARCHAR(30) NOT NULL ,
      telephone VARCHAR(20),
      date_purchased DATETIME NOT NULL ,
      comments VARCHAR(500) ,
      total_price FLOAT DEFAULT 0,
      discount FLOAT DEFAULT 0 ,
      state ENUM ('pendiente','pagado') ,
      user_id INT UNSIGNED , 
      cart_id INT UNSIGNED ,
      FOREIGN KEY fk_user_id(user_id) REFERENCES user(id) ,
      FOREIGN KEY fk_cart_id(cart_id) REFERENCES cart(id) ,
      PRIMARY KEY (id)
      );
    `);
    console.log('tabla invoice creada');

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
