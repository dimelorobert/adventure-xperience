'use strict';

const {
  getConnection
} = require('./database');
const args = process.argv;
const dataDB = (args[2] === '--data');
let connection;



async function main() {
  try {
    connection = await getConnection();


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
      image VARCHAR(60),
      creation_date TIMESTAMP,
      modify_date TIMESTAMP,
      ip VARCHAR(50),
      PRIMARY KEY(id)
      );
    `);
    console.log('Creada la tabla user');

    await connection.query(`CREATE TABLE IF NOT EXISTS category ( 
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(60) NOT NULL,
      image VARCHAR(120),
      creation_date TIMESTAMP,
      modify_date TIMESTAMP,
      PRIMARY KEY(id)
      );
    `);
    console.log('Creada la tabla category');

    await connection.query(`CREATE TABLE IF NOT EXISTS adventure ( 
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(60) NOT NULL ,
      description VARCHAR(500) NOT NULL,
      image VARCHAR(120) ,
      price DECIMAL(5,2) ,
      country VARCHAR(60) NOT NULL ,
      city VARCHAR(60) NOT NULL ,
      vacancy INT NOT NULL, 
      isAvailable ENUM("Disponible","No Disponible"),
      creation_date TIMESTAMP,
      modify_date TIMESTAMP,
      date_selected TIMESTAMP,
      category_id INT UNSIGNED ,
      FOREIGN KEY fk_category_id (category_id) REFERENCES category(id) , 
      PRIMARY KEY(id)
      );`);
    console.log('Creada la tabla adventure');

    await connection.query(`CREATE TABLE IF NOT EXISTS cart ( 
      id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
      purchased_date TIMESTAMP,
      total_price DECIMAL(5,2), 
      paid BOOLEAN,
      user_id INT UNSIGNED ,
      adventure_id INT UNSIGNED ,   
      FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
      FOREIGN KEY adventure_id (adventure_id) REFERENCES adventure(id) ,
      PRIMARY KEY (id)
      );`);
    console.log('Creada tabla cart');

    await connection.query(`CREATE TABLE IF NOT EXISTS chat ( 
      id INT UNSIGNED NOT NULL AUTO_INCREMENT ,
      message VARCHAR(500) , 
      date_post TIMESTAMP, 
      user_id INT UNSIGNED ,
      adventure_id INT UNSIGNED,
      FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
      FOREIGN KEY fk_adventure_id (adventure_id) REFERENCES adventure(id) ,
      PRIMARY KEY (id)
      );`);
    console.log('Creada tabla chat');

    await connection.query(`CREATE TABLE IF NOT EXISTS review ( 
      id INT UNSIGNED NOT NULL AUTO_INCREMENT ,
      points INT NOT NULL ,
      comments VARCHAR(500) ,
      date_post TIMESTAMP, 
      ip VARCHAR(50),
      user_id INT UNSIGNED ,
      adventure_id INT UNSIGNED ,   
      FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
      FOREIGN KEY adventure_id (adventure_id) REFERENCES adventure(id) ,
      PRIMARY KEY (id)
      );`);
    console.log('Creada tabla review');

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
      date_purchased TIMESTAMP,
      comments VARCHAR(500) ,
      total_price FLOAT DEFAULT 0,
      discount DECIMAL(5,2) DEFAULT 0 ,
      state ENUM ('pendiente','pagado') ,
      cart_id INT UNSIGNED ,
      FOREIGN KEY fk_cart_id(cart_id) REFERENCES cart(id) ,
      PRIMARY KEY (id)
      );`);
    console.log('Creada tabla invoice');


    if (dataDB) {
      await connection.query(`INSERT INTO user VALUES( null,'Ana', 
        'Verdeal', 
        '1995-09-09', 
        'España', 
        'Alicante',
        'lilMileG',
        'anav@hotmail.com', 
        '123AnV.',
        'https://img.com/avatar.jpg',
        '2020-01-10 17:30:00'
        );`);
      await connection.query(`INSERT INTO user VALUES ( null, 'Robert', 
        'Hernandez', 
        '1990-04-06', 
        'España',
        'A Coruña',
        'DimeloRobert', 
        'robert@mail.com', 
        'rbt845.', 
        'https://img.com/avatar.jpg',
        '2020-01-29 05:50:06');`);
      await connection.query(`INSERT INTO user VALUES( null, 'Miguel Angel', 
        'Duque', 
        '1999-06-07', 
        'España', 
        'Valencia',
        'duquecito7',
        'duquecito7@yahoo.com', 
        'Duquecito123',
        'https://img.com/avatar.jpg',
        '2020-06-30 17:30:00');`);
      console.log('Usuarios default integrados');

      await connection.query(`INSERT INTO category VALUES(null, 'Relax Time', 'https://img.com/img.jpg','2004-01-29 05:50:06','2004-01-29 09:50:06');`);
      await connection.query(`INSERT INTO category VALUES(null, 'Aventuras en la Montaña', 'https://img.com/img.jpg','2004-02-4 10:34:16');`);
      await connection.query(`INSERT INTO category VALUES(null, 'Aventuras Acuaticas', 'https://img.com/img.jpg','2004-02-4 10:34:16',3);`);
      console.log('Categorias default integradas');

      await connection.query(``);
      await connection.query(``);
      await connection.query(``);
      console.log('Aventuras default integradas');
    }
    console.log('✅✅✅ Estructura de base de datos creada exitosamente ✅✅');
    console.log('>>>>>> 🔥🔥🔥 Database Working 100% 🔥🔥🔥 <<<<<<');

  } catch (error) {
    console.error(error);
  } finally {
    if (connection) {
      connection.release();
      process.exit();
    }
  }
}

main();