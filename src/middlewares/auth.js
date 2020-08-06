require('dotenv').config();
const jwt = require('jsonwebtoken');

const {
    getConnection
} = require('../database');
const {
    generateError
} = require('../helpers');

async function userIsAuthenticated(request, response, next) {
    let connection;
    try {
        const {
            authorization
        } = request.headers;

        if (!authorization) {
            throw generateError('Falta la cabecera de authorization', 401);
        }

        const authorizationParts = authorization.split(' ');

        let token;

        if (authorizationParts.length === 1) {
            token = authorization;
        } else if (authorizationParts[0] === 'Bearer') {
            token = authorizationParts[1];
        } else {
            throw generateError('No puedo leer el token', 401);
        }

        let decoded;

        decoded = jwt.verify(token, process.env.SECRET);

        // Comprobar fecha de emision del token

        const {
            id,
            iat
        } = decoded;

        connection = await getConnection();

        const [result] = await connection.query(`select last_password_update from user where id=?;`, [id]);

        if (!result.length) {
            throw generateError('El usuario no existe en la base de datos', 401);
        }

        const [user] = result;
        console.log(user);
        console.log(new Date(iat * 1000));
        console.log(new Date(user.last_password_update));

        if (new Date(iat * 1000) < new Date(user.last_password_update)) {
            throw new Error('El token ya no vale, haz login para conseguir otro');
        }

        req.auth = decoded;

        next();
    } catch (error) {
        const authError = new Error('Invalid authorization');
        authError.httpCode = 401;
        next(authError);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

function userIsAdmin(request, response, next) {
    if (!request.auth || request.auth.role !== 'admin') {
        const error = new Error('No tienes privilegios de administrador');
        error.httpCode = 401;
        return next(error);
    }
    next();
}

module.exports = {
    userIsAuthenticated,
    userIsAdmin
};