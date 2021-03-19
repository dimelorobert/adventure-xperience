// required modules to use
import getConnection from "../../../services/database";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import path from "path";
import helpers from "../../../helpers";
import logger from "../../../helpers/logger";

// uploading global variables to use
const { SECRET_KEY, EXPIRATION_TOKEN, ERROR_PATH_LOGS } = process.env;

const locationNamefile = path.parse(__filename).base;

// we define the variable to connect to db
let connectionDB;

async function loginUser(request, response, next) {
	try {
		// open connection to db
		connectionDB = await getConnection();

		// validate data from request body
		await registerSchema.validateAsync(request.body);
		const { email, password } = request.body;

		// we check if the account exist
		const [userExistAndIsActive] = await connectionDB.query(
			`SELECT id, password, is_account_active, is_admin 
         FROM users 
         WHERE email=? `,
			[email],
		);

		if (userExistAndIsActive.length === 0 || !userExistAndIsActive[0].id) {
			const infoError4Devs = {
				errorName: "DATABASE WARNING",
				errorDescription: "El usuario no existe",
				errorLocationFile: locationNamefile,
				errorBlockCode: "[userExistAndIsActive]",
				errorFolderFile: path.join(
					__dirname,
					`../../../../${ERROR_PATH_LOGS}`,
				),
				errorDatetime: helpers.formatDate4Vue(new Date()),
			};
			logger.warn(infoError4Devs);

			return response.status(401).json({
				message: `La cuenta no existe, por favor registrate`,
			});
		}

		// we check if the account is activated
		if (!userExistAndIsActive[0].is_account_active === 0) {
			return response.status(401).json({
				message: `La cuenta no esta activada`,
			});
		}

		// we compare password body with db password
		const passwordMatch = bcrypt.compareSync(
			password,
			userExistAndIsActive[0].password,
		);
		if (!passwordMatch) {
			return response.status(401).json({
				message: `Contraseña incorrecta`,
			});
		}

		// build a payload for the token
		const tokenPayload = {
			id: userExistAndIsActive[0].id,
			is_admin: userExistAndIsActive[0].is_admin,
			is_account_active: userExistAndIsActive[0].is_account_active,
		};

		// generate a token with the payload
		const token = sign(tokenPayload, SECRET_KEY, {
			expiresIn: EXPIRATION_TOKEN,
		});

		await connectionDB.query(
			`UPDATE users 
         SET last_connection=CURRENT_TIMESTAMP()
         WHERE email=?`,
			[email],
		);

		// if everything it's ok we sen a json
		response.status(200).json({
			data: {
				...tokenPayload,
				token,
			},
			message: `Iniciando sesión`,
		});
	} catch (error) {
		next(error);
		console.log("FROM LOGIN ERROR", error);
	} finally {
		if (connectionDB) connectionDB.release();
	}
}
export default loginUser;
