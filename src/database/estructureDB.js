// Crear conexión  a la base de datos
import connectionDB from './connectionDB';

// Importa todos los modelos de las tablas para crear la base de datos
require('../models');

const structureDB = async () => {
    try {
        // con force: true Dropea las tablas de la base de datos y con force: false las crea
        await connectionDB.sync({
            force: false
        });
        console.log('Created database estructure ');
    } catch (error) {
        console.log('It was an error creating the structure of database', error);
    }
};
structureDB()

module.exports = structureDB;