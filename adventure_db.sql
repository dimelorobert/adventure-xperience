/*//////////////////////////////////////// BASE DE DATOS AVENTURAS ///////////////////////*/
/* Crear base de datos*/
CREATE DATABASE IF NOT EXISTS adventure_db;
/* Usar base de datos*/
USE adventure_db;
/*//////////////////////////////////////// TABLA USUARIO ///////////////////////////////*/
CREATE TABLE IF NOT EXISTS user ( 
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
PRIMARY KEY(id)
);

/*//////////////////////////////////////// TABLA CATEGORIA ///////////////////////////////*/
CREATE TABLE IF NOT EXISTS category ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(60) NOT NULL,
image VARCHAR(120) NOT NULL,
date_creation DATETIME,
PRIMARY KEY(id)
);
/*//////////////////////////////////////// TABLA AVENTURA ///////////////////////////////*/
CREATE TABLE IF NOT EXISTS adventure ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(60) NOT NULL ,
description VARCHAR(500) NOT NULL,
image VARCHAR(120) ,
video VARCHAR(120),
price DECIMAL(5,2) ,
country VARCHAR(60) NOT NULL ,
city VARCHAR(60) NOT NULL ,
vacancy INT NOT NULL DEFAULT 10, 
available BOOLEAN ,
date_selected DATETIME NOT NULL,
category_id INT UNSIGNED , 
FOREIGN KEY fk_category_id (category_id) REFERENCES category(id) , 
PRIMARY KEY(id)
);
/*//////////////////////////////////////// TABLA CART /////////////////////////////////*/
CREATE TABLE IF NOT EXISTS cart ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
purchased_date DATETIME NOT NULL,
total_price DECIMAL(5,2), 
paid BOOLEAN,
user_id INT UNSIGNED ,
adventure_id INT UNSIGNED ,   
FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
FOREIGN KEY adventure_id (adventure_id) REFERENCES adventure(id) ,
PRIMARY KEY (id)
);
/*//////////////////////////////////////// TABLA CHAT /////////////////////////////////*/
CREATE TABLE IF NOT EXISTS chat ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT ,
message VARCHAR(500) , 
date_post DATETIME , 
user_id INT UNSIGNED ,
adventure_id INT UNSIGNED,
FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
FOREIGN KEY fk_adventure_id (adventure_id) REFERENCES adventure(id) ,
PRIMARY KEY (id)
);
/*//////////////////////////////////////// TABLA RESEÑA ///////////////////////////////*/
CREATE TABLE IF NOT EXISTS review ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT ,
points INT NOT NULL ,
comments VARCHAR(500) ,
date_post DATETIME NOT NULL , 
user_id INT UNSIGNED ,
adventure_id INT UNSIGNED ,   
FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
FOREIGN KEY adventure_id (adventure_id) REFERENCES adventure(id) ,
PRIMARY KEY (id)
);
/*//////////////////////////////////////// TABLA FACTURAS /////////////////////////////*/
CREATE TABLE IF NOT EXISTS invoice ( 
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
cart_id INT UNSIGNED ,
FOREIGN KEY fk_cart_id(cart_id) REFERENCES cart(id) ,
PRIMARY KEY (id)
);

/*---------------------------------------------------------------------------------------------------*/
/* Insertar datos en las filas creadas en las tablas*/
INSERT INTO user VALUES();
/* Muestra los tipo de datos de la tabla*/
DESCRIBE user;
/* Mostrar tabla*/
SHOW TABLES;
/* Eliminar tabla por completo*/
DROP TABLE adventures;
/* Eliminar database`por completo*/
DROP DATABASE adventure_db;
/* Eliminar fila en concreto*/
DELETE FROM user WHERE id = 10;
/* Eliminar campos tabla*/
TRUNCATE TABLE user;

/*////////////////////////////////////// USUARIOS EN TABLAS ///////////////////////////////////////////*/
/* consultar usuarios tabla USER*/
SELECT * FROM user; 
/*----------------------------------------------------------------------------------*/
INSERT INTO user VALUES( null,'Ana', 
 'Verdeal', 
 '1995-09-09', 
 'España', 
 'Alicante',
 'lilMileG',
 'anav@hotmail.com', 
 '123AnV.',
 'https://img.com/avatar.jpg',
 '2020-01-10 17:30:00'
 );
INSERT INTO user VALUES ( null, 'Robert', 
'Hernandez', 
'1990-04-06', 
'España',
'A Coruña',
'DimeloRobert', 
'airbusjayrobert@gmail.com', 
'Robert591.', 
'https://img.com/avatar.jpg',
'2020-01-29 05:50:06');
INSERT INTO user VALUES( null, 'Miguel Angel', 
'Duque', 
'1999-06-07', 
'España', 
'Valencia',
'duquecito7',
'duquecito7@yahoo.com', 
'Duquecito123',
'https://img.com/avatar.jpg',
'2020-06-30 17:30:00');
/*////////////////////////////////////// CATEGORY EN TABLAS ///////////////////////////////////////////*/
/* consultar usuarios tabla CATEGORY*/
SELECT * FROM category;
INSERT INTO category VALUES(null, 'Paracaidismo', 'https://img.com/img.jpg','2004-01-29 05:50:06');
INSERT INTO category VALUES(null, 'Kayak', 'https://img.com/img.jpg','2004-02-4 10:34:16');
INSERT INTO category VALUES(null, 'Kayak', 'Excursion Kayak en grupo', 'https://img.com/img.jpg','2004-02-4 10:34:16',3);
INSERT INTO category VALUES(null, 'Buceo', 'Excursion Buceo en grupo', 'https://img.com/img.jpg','2005-09-16 07:04:06',2);

/*////////////////////////////////////// AVENTURAS EN TABLAS ///////////////////////////////////////////*/
/* consultar usuarios tabla ADVENTURES*/
SELECT * FROM adventures;
INSERT INTO adventure VALUES(null, 'Paracaidismo', 'Excursion Paracaidas en grupo', 
'https://img.com/img.jpg',50.95,'España', 'Valencia', 5,'2020-01-15 16:30:22',3,1);
INSERT INTO adventure VALUES(null, 'Kayak', 'Excursion Kayak en grupo', 'https://img.com/img.jpg', 49.50, 'España', 'Alicante', 3, '2004-02-4 10:34:16',1,2);
