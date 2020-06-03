/*//////////////////////////////////////// BASE DE DATOS AVENTURAS ///////////////////////*/
/* Crear base de datos*/
CREATE DATABASE IF NOT EXISTS adventure_db;
/* Usar base de datos*/
USE adventure_db;
/*//////////////////////////////////////// TABLA USUARIO ///////////////////////////////*/
CREATE TABLE IF NOT EXISTS user ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL ,
surname VARCHAR(60) NOT NULL , 
date_birth DATE NOT NULL ,
address VARCHAR(60),
country VARCHAR(30) NOT NULL ,
city VARCHAR(30) NOT NULL , 
nickname VARCHAR(20) NOT NULL UNIQUE, 
email VARCHAR(60) NOT NULL UNIQUE,
password VARCHAR(16) NOT NULL , 
avatar VARCHAR(60) ,
role ENUM('admin','userRole'), 
creating_date DATETIME NOT NULL,
updating_date DATETIME NOT NULL,
ip VARCHAR(20) NOT NULL , 
PRIMARY KEY(id)
);

/*//////////////////////////////////////// TABLA CATEGORIA ///////////////////////////////*/
CREATE TABLE IF NOT EXISTS category ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(60) NOT NULL ,
image VARCHAR(120) ,
date_creation DATETIME NOT NULL,
user_id INT UNSIGNED ,  
FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
PRIMARY KEY(id , user_id)
);
/*//////////////////////////////////////// TABLA AVENTURA ///////////////////////////////*/
CREATE TABLE IF NOT EXISTS adventure ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(60) NOT NULL ,
description VARCHAR(500) NOT NULL,
image VARCHAR(120),
video VARCHAR(120),
price DECIMAL(5,2) ,
country VARCHAR(60) NOT NULL ,
city VARCHAR(60) NOT NULL ,
vacancy INT NOT NULL DEFAULT 10, 
available BOOLEAN ,
date_selected DATETIME NOT NULL,
user_id INT UNSIGNED , 
category_id INT UNSIGNED , 
FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
FOREIGN KEY fk_category_id (category_id) REFERENCES category(id) , 
PRIMARY KEY(id, user_id, category_id)
);
/*//////////////////////////////////////// TABLA CART /////////////////////////////////*/
CREATE TABLE IF NOT EXISTS cart ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
selected_date DATETIME NOT NULL,
purchased_date DATETIME NOT NULL,
total_price FLOAT DEFAULT 0, 
user_id INT UNSIGNED ,
adventure_id INT UNSIGNED ,   
FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
FOREIGN KEY adventure_id (adventure_id) REFERENCES adventures(id) ,
PRIMARY KEY (id , user_id, adventure_id)
);
/*//////////////////////////////////////// TABLA CHAT /////////////////////////////////*/
CREATE TABLE IF NOT EXISTS chat ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT ,
message VARCHAR(500) , 
date_post DATETIME , 
user_id INT UNSIGNED ,
FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
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
FOREIGN KEY adventure_id (adventure_id) REFERENCES adventures(id) ,
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
user_id INT UNSIGNED , 
cart_id INT UNSIGNED ,
FOREIGN KEY fk_user_id(user_id) REFERENCES user(id) ,
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
DELETE FROM user WHERE id = 1;
/* Eliminar campos tabla*/
TRUNCATE TABLE user;

/*////////////////////////////////////// USUARIOS EN TABLAS ///////////////////////////////////////////*/
/* consultar usuarios tabla USER*/
SELECT * FROM user; 
/*----------------------------------------------------------------------------------*/
INSERT INTO user VALUES( null,'Ana', 
 'Verdeal', 
 '1995-09-09', 
 'Plaza del Comercio 15 , 2.Izq',
 'España', 
 'Alicante',
 'lilMileG',
 'anav@hotmail.com', 
 '123AnV.',
 'https://img.com/avatar.jpg',
 'user', 
 '2020-01-10 17:30:00', 
 '2020-01-15 10:20:02', 
 '58.234.91.02'
 );
INSERT INTO user VALUES ( null, 'Robert', 
'Hernandez', 
'1990-04-06', 
'Calle Estrella 16 piso 4 puerta 401',  
'España',
'A Coruña',
'DimeloRobert', 
'airbusjayrobert@gmail.com', 
'Robert591.', 
'https://img.com/avatar.jpg',
'user', 
'2020-01-29 05:50:06', 
'2020-02-02 15:50:36', 
'87.219.91.42');
INSERT INTO user VALUES( null, 'Miguel Angel', 
'Duque', 
'1999-06-07', 
'Avenida Travalon 16 piso 5d', 
'España', 
'Valencia',
'duquecito7',
'duquecito7@yahoo.com', 
'Duquecito123',
'https://img.com/avatar.jpg',
'user', 
'2020-06-30 17:30:00', 
'2020-01-15 14:20:02',
'18.344.41.102');
/*////////////////////////////////////// CATEGORY EN TABLAS ///////////////////////////////////////////*/
/* consultar usuarios tabla CATEGORY*/
SELECT * FROM category;
INSERT INTO category VALUES(null, 'Paracaidismo', 'Excursion Paracaidas en grupo', 'https://img.com/img.jpg','2004-01-29 05:50:06',3);
INSERT INTO category VALUES(null, 'Kayak', 'Excursion Kayak en grupo', 'https://img.com/img.jpg','2004-02-4 10:34:16',1);
INSERT INTO category VALUES(null, 'Kayak', 'Excursion Kayak en grupo', 'https://img.com/img.jpg','2004-02-4 10:34:16',3);
INSERT INTO category VALUES(null, 'Buceo', 'Excursion Buceo en grupo', 'https://img.com/img.jpg','2005-09-16 07:04:06',2);

/*////////////////////////////////////// AVENTURAS EN TABLAS ///////////////////////////////////////////*/
/* consultar usuarios tabla ADVENTURES*/
SELECT * FROM adventures;
INSERT INTO adventures VALUES(null, 'Paracaidismo', 'Excursion Paracaidas en grupo', 
'https://img.com/img.jpg',50.95,'España', 'Valencia', 5,'2020-01-15 16:30:22',3,1);
INSERT INTO adventures VALUES(null, 'Kayak', 'Excursion Kayak en grupo', 'https://img.com/img.jpg', 49.50, 'España', 'Alicante', 3, '2004-02-4 10:34:16',1,2);
