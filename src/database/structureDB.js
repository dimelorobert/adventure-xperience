'use strict';

// Crear conexión  a la base de datos
import connectionDB from './sequelizeConnection';

// Importa todos los modelos de las tablas para crear la base de datos
import '../models';

const structureDB = async () => {
  try {
    // con force: true Dropea las tablas de la base de datos y con force: false las crea
    await connectionDB.sync({
      force: false
    });

    console.log('La estructura de la base de datos fue creada con éxito');
  } catch (error) {
    console.log(
      'Ha ocurrido un error al crear la estructura de la base de datos :::',
      error
    );
  }
};

export default structureDB;
