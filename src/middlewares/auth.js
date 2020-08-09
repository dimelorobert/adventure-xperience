require('dotenv').config();
const {
    SECRET_KEY
} = process.env;

const jwt = require('jsonwebtoken');

const {
    getConnection
} = require('../database');
const {
    helpers
} = require('../helpers');

async function userIsAuthenticated(request, response, next) {
    let connection;
    try {
        const {
            authorization
        } = request.headers;

        if (!authorization) {
            throw helpers.errorGenerator('Falta la cabecera de authorization', 401);
        }

        const authorizationParts = authorization.split(' ');

        let token;

        if (authorizationParts.length === 1) {
            token = authorization;
        } else if (authorizationParts[0] === 'Bearer') {
            token = authorizationParts[1];
        } else {
            throw helpers.errorGenerator('No puedo leer el token', 401);
        }

        let decoded;

        // Comprobar fecha de emision del token
        try {
            decoded = jwt.verify(token, SECRET_KEY);
            console.log(decoded);
        } catch (error) {
            throw helpers.errorGenerator('El token no es correcto', 401)
        }
        const {
            id,
            iat
        } = decoded;
        console.log(id);

        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT last_password_update 
            FROM user 
            WHERE id=?;`,
            [id]);


        if (!result.length) {
            throw helpers.errorGenerator('El usuario no existe en la base de datos', 401);
        }

        const [user] = result;
        console.log(user);
        console.log(new Date(iat * 1000));
        console.log(new Date(user.last_password_update));

        if (new Date((iat + 7200) * 1000) < new Date(user.last_password_update)) {
            throw new Error('El tokenha expirado, haz login para conseguir otro');
        }

        request.auth = decoded;

        next();
    } catch (error) {
        const authError = new Error('Invalid authorization');
        authError.httpCode = 401;
        next(error);
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