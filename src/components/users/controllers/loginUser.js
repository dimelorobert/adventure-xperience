import getConnection from "../../../database";
import { createSchema } from "../validations";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const { SECRET_KEY } = process.env;

// we open connection to db
let connectionDB;

async function loginUser(request, response, next) {
  try {
    connectionDB = await getConnection();
    await createSchema.validateAsync(request.body);
    const { email, password } = request.body;

    const [userExistAndIsActive] = await connectionDB.query(
      `
        SELECT is_account_active, id, password, is_admin
        FROM users 
        WHERE email=? `,
      [email]
    );

    if (!userExistAndIsActive[0].id) {
      return response.status(401).json({
        message: `La cuenta no existe`,
      });
    }

    if (!userExistAndIsActive[0].is_account_active === 0) {
      return response.status(401).json({
        message: `La cuenta no esta activada`,
      });
    }

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
      is_admin: userExistAndIsActive[0].is_admin,
    };
    const token = jwt.sign(
      {
        tokenPayload,
      },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
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
