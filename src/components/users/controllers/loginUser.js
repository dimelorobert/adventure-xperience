import getConnection from "../../../database";
import { registerSchema } from "../validations";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const { SECRET_KEY, EXPIRATION_TOKEN } = process.env;

// we open connection to db
let connectionDB;

async function loginUser(request, response, next) {
  try {
    // we open connection to db
    connectionDB = await getConnection();

    // we validate type data received from client
    await registerSchema.validateAsync(request.body);
    const { email, password } = request.body;

    const [userExistAndIsActive] = await connectionDB.query(
      `
        SELECT is_account_active, id, password, is_admin
        FROM users 
        WHERE email=? `,
      [email]
    );

    // we check if the account exist
    if (!userExistAndIsActive[0].id) {
      return response.status(401).json({
        message: `La cuenta no existe, por favor crea una cuenta`,
      });
    }

    // we check if the account is activated
    if (!userExistAndIsActive[0].is_account_active === 0) {
      return response.status(401).json({
        message: `La cuenta no esta activada`,
      });
    }

    // we check the passwords
    const passwordMatch = await bcrypt.compare(
      password,
      userExistAndIsActive[0].password
    );

    if (!passwordMatch) {
      return response.status(401).json({
        message: `Contraseña incorrecta`,
      });
    }
    const tokenPayload = {
      id: userExistAndIsActive[0].id,
      email: email,
      password: userExistAndIsActive[0].password,
      is_admin: userExistAndIsActive[0].is_admin,
    };

    const token = sign(tokenPayload, SECRET_KEY, {
      expiresIn: EXPIRATION_TOKEN,
    });

    return response.status(200).json({
      data: {
        ...tokenPayload,
        token,
      },
      message: `Has iniciado sesión`,
    });
  } catch (error) {
    next(error);
  } finally {
    connectionDB.release();
  }
}
export default loginUser;
