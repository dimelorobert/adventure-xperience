/*//////////////////////////////////////// BASE DE DATOS AVENTURAS ///////////////////////*/
/* Crear base de datos*/
CREATE DATABASE IF NOT EXISTS adventure_db;
/* Usar base de datos*/
USE adventure_db;
/*//////////////////////////////////////// TABLA USUARIO ///////////////////////////////*/
CREATE TABLE IF NOT EXISTS user ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(35) NOT NULL ,
surname VARCHAR(35) NOT NULL , 
date_birth DATE NOT NULL ,
dni VARCHAR(20),
address VARCHAR(60) NOT NULL ,
zipcode VARCHAR(20) ,
country VARCHAR(60) NOT NULL ,
city VARCHAR(60) NOT NULL , 
email VARCHAR(100) NOT NULL ,
telephone VARCHAR(20),
username VARCHAR(16) NOT NULL ,
password VARCHAR(16) NOT NULL , 
avatar VARCHAR(120) ,
creating_date DATETIME NOT NULL,
updating_date DATETIME NOT NULL,
ip VARCHAR(20) NOT NULL , 
PRIMARY KEY(id)
);

/*//////////////////////////////////////// TABLA CATEGORIA ///////////////////////////////*/
CREATE TABLE IF NOT EXISTS category ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(35) NOT NULL ,
description VARCHAR(500) ,
image VARCHAR(120) ,
date_creation DATETIME NOT NULL,
user_id INT UNSIGNED ,  
FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
PRIMARY KEY(id , user_id)
);
/*//////////////////////////////////////// TABLA AVENTURA ///////////////////////////////*/
CREATE TABLE IF NOT EXISTS adventure ( 
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
);
/*//////////////////////////////////////// TABLA CART /////////////////////////////////*/
CREATE TABLE IF NOT EXISTS cart ( 

id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
checkout_date DATETIME NOT NULL,
purchase_date DATETIME NOT NULL,
total_price FLOAT DEFAULT 0, 
user_id INT UNSIGNED ,
adventure_id INT UNSIGNED ,   
FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
FOREIGN KEY adventure_id (adventure_id) REFERENCES adventure(id) ,
PRIMARY KEY (id , user_id, adventure_id)
);
/*//////////////////////////////////////// TABLA CHAT /////////////////////////////////*/
CREATE TABLE IF NOT EXISTS chat ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT , 
mesaage VARCHAR(500) , 
date_post DATETIME , 
user_id INT UNSIGNED ,
FOREIGN KEY fk_user_id (user_id) REFERENCES user(id) ,
PRIMARY KEY (id)
);
/*//////////////////////////////////////// TABLA RESEÑA ///////////////////////////////*/
CREATE TABLE IF NOT EXISTS review ( 
id INT UNSIGNED NOT NULL AUTO_INCREMENT ,
points VARCHAR(35) NOT NULL ,
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
name VARCHAR(35) NOT NULL ,
surname VARCHAR(35) NOT NULL ,  
dni VARCHAR(20),
address VARCHAR(60) NOT NULL ,
zipcode VARCHAR(20) ,
country VARCHAR(60) NOT NULL ,
city VARCHAR(60) NOT NULL , 
email VARCHAR(30) NOT NULL ,
telephone VARCHAR(20),
date_purchase DATETIME NOT NULL ,
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
DROP TABLE adventure;
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
INSERT INTO user VALUES( null, 'Ana', 'Verdeal', '1995-09-09', '34675890w', 'Plaza del Comercio 15 , 2.Izq', '03130','España', 'Alicante', 'anav@hotmail.com', 
'670943632', 'lilMileG', '123AnV.','https://img.com/avatar.jpg', '2020-01-10 17:30:00', '2020-01-15 10:20:02', '58.234.91.02');
INSERT INTO user VALUES ( null, 'Robert', 'Hernandez', '1990-04-06', 'x1024453d' , 'Calle Estrella 16 piso 4 puerta 401', '15003' , 'España','A Coruña', 'airbusjayrobert@gmail.com', 
'675389333', 'DimeloRobert', 'Robert591.', 'https://img.com/avatar.jpg', '2020-01-29 05:50:06', '2020-02-02 15:50:36', '87.219.91.42');
INSERT INTO user VALUES( null, 'Miguel Angel', 'Duque', '1999-06-07', '20394958h', 'Avenida Travalon 16 piso 5d', null,'España', 'Valencia', 'duquecito7@yahoo.com', 
'601944530', 'duquecito7', 'Duquecito123','https://img.com/avatar.jpg', '2020-06-30 17:30:00', '2020-01-15 14:20:02','18.344.41.102');
/*////////////////////////////////////// CATEGORY EN TABLAS ///////////////////////////////////////////*/
/* consultar usuarios tabla CATEGORY*/
SELECT * FROM category;
INSERT INTO category VALUES(null, 'Paracaidismo', 'Excursion Paracaidas en grupo', 'https://img.com/img.jpg','2004-01-29 05:50:06',3);
INSERT INTO category VALUES(null, 'Kayak', 'Excursion Kayak en grupo', 'https://img.com/img.jpg','2004-02-4 10:34:16',1);
INSERT INTO category VALUES(null, 'Kayak', 'Excursion Kayak en grupo', 'https://img.com/img.jpg','2004-02-4 10:34:16',3);
INSERT INTO category VALUES(null, 'Buceo', 'Excursion Buceo en grupo', 'https://img.com/img.jpg','2005-09-16 07:04:06',2);

/*////////////////////////////////////// AVENTURAS EN TABLAS ///////////////////////////////////////////*/
/* consultar usuarios tabla ADVENTURES*/
SELECT * FROM adventure;
INSERT INTO adventure VALUES(null, 'Paracaidismo', 'Excursion Paracaidas en grupo', 'https://img.com/img.jpg',50.95, 'Valaencia', 5,'2020-01-15 16:30:22',3,1);
INSERT INTO adventure VALUES(null, 'Kayak', 'Excursion Kayak en grupo', 'https://img.com/img.jpg', 49.50, 'Alicante', 3, '2004-02-4 10:34:16',1,2);
