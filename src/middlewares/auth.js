require('dotenv').config();
const {
    SECRET_KEY
} = process.env;
const jwt = require('jsonwebtoken');

const {
    getConnection
} = require('../database/sequelize-connection');


async function userIsAuthenticated(request, response, next) {
    let connection;

    try {
        // Check if the authorization header is valid
        const {
            authorization
        } = request.headers;

        if (!authorization) {
            return response.status(401).json({
                status: 'error',
                code: 401,
                error: `Hace falta el headers`
            });
        }

        const authorizationParts = authorization.split(' ');

        let token;

        if (authorizationParts.length === 1) {
            token = authorization;
        } else if (authorizationParts[0] === 'Bearer') {
            token = authorizationParts[1];
        } else {
            return response.status(401).json({
                status: 'error',
                code: 401,
                error: `No se puede leer el token`
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (error) {
            return response.status(401).json({
                status: 'error',
                code: 401,
                error: `token incorrecto`
            });
        }

        // Comprobar que la fecha de expedición del token sea mayor a la
        // fecha de última actualización de password del usuario
        const {
            tokenPayload
        } = decoded;
        const {
            id,
            iat
        } = tokenPayload;
        //console.log(tokenPayload);

        connection = await getConnection();

        const [
            result
        ] = await connection.query(
            'SELECT last_password_update FROM users WHERE id=?',
            [id]
        );

        if (!result.length) {
            return response.status(401).json({
                status: 'error',
                code: 401,
                error: `No hay ningún usuario asociado a este token`
            });
        }

        const [user] = result;

        // comprobar que la fecha del token menor mayor que user.lastPasswordUpdate
        // Tened en cuenta que el iat del token está guardado en segundos y node trabaja en
        // milisegundos
        if (new Date(iat * 1000) < new Date(user.lastPasswordUpdate)) {
            return response.status(401).json({
                status: 'error',
                code: 401,
                error: `Token invalido , obtén otro iniciando sesión`
            });;
        }

        request.authorization = decoded;

        next();
    } catch (error) {
        error.httpCode = 401;
        next(error);
    } finally {
        if (connection) connection.release();
    }
}

function userIsAdmin(request, response, next) {
    const {
        tokenPayload
    } = request.authorization;
    console.log(tokenPayload);
    const {
        role
    } = tokenPayload;
    if (!tokenPayload || role !== 'admin') {
        return response.status(401).json({
            status: 'error',
            code: 401,
            error: `No tienes privilegios de administrador`
        });
    }

    next();
}

module.exports = {
    userIsAuthenticated,
    userIsAdmin
};