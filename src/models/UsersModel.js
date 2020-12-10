'use strict';

// Desestructuramos Datatypes del modulo de SEQUELIZE para poder formar la tabla en la base de datos
import { Sequelize, DataTypes } from 'sequelize';
/*const {
    Sequelize,
    DataTypes
} = require('sequelize');*/

// Importamos la conexión a la base de datos
import connectionDB from '../database/sequelizeConnection';

// importamos moduloque genera id alfanumerico aleatorios
import shortid from 'shortid';

// Definimos la estructura de la tabla de la base de datos
const UsersModel = connectionDB.define('users', {
    id: {
        type: DataTypes.STRING,
        defaultValue: shortid.generate,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_birth: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'avatar-0.jpg',
    },
    genre: {
        type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
        allowNull: true,
        defaultValue: 'Otro',
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Sin especificar',
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Sin especificar',
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Sin especificar',
    },
    telephone: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    acept_terms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    is_subscribed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    activation_code_account: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    account_is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    facebook: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    instagram: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    youtube: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: true,
    },
});

export default UsersModel;
