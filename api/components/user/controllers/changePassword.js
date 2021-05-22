import getConnection from "../../../database";
import { processFiles } from "../../../services";
import { uploadURLImageSchema } from "../validations";
import bcrypt from "bcrypt";

// we open connection to db
let connectionDB;

async function changePassword(request, response, next) {
  try {
    connectionDB = await getConnection();
    const { id } = request.params;

    // Body: oldPassword, newPassword,
    await newPasswordSchema.validateAsync(request.body);

    const { oldPassword, newPassword, newPasswordRepeat } = request.body;

    const { tokenPayload } = request.authorization;
    console.log(tokenPayload);

    if (Number(id) !== tokenPayload.id) {
      return response.status(401).json({
        status: "error",
        code: 401,
        message: `No tienes permisos para cambiar la password de usuario`,
      });
    }

    if (newPassword !== newPasswordRepeat) {
      return response.status(400).json({
        status: "error",
        code: 400,
        message: "La nueva contraseña no coincide con su repetición",
      });
    }

    if (oldPassword === newPassword) {
      return response.status(401).json({
        status: "error",
        code: 401,
        message: "La contraseña nueva no puede ser la misma que la antigua",
      });
    }

    const [currentUser] = await connectionDB.query(
      `
      SELECT id, password FROM users WHERE id=?
    `,
      [id]
    );

    if (!currentUser.length) {
      return response.status(404).json({
        status: "error",
        code: 404,
        message: `El usuario con id: ${id} no existe`,
      });
    }

    const [dbUser] = currentUser;

    // Comprobar la vieja password

    const passwordsMath = await bcrypt.compare(oldPassword, dbUser.password);

    if (!passwordsMath) {
      return response.status(401).json({
        status: "error",
        code: 401,
        message: `Contraseña incorrecta`,
      });
    }

    // hash nueva password

    const dbNewPassword = await bcrypt.hash(newPassword, 10);

    await connectionDB.query(
      `
        UPDATE users 
        SET password=? ,last_password_update=? 
        WHERE id=?
    `,
      [dbNewPassword, new Date(), id]
    );

    response.send({
      status: "ok",
      message:
        "La contraseña se ha actualizado correctamente, vuelve a hacer login",
    });
  } catch (error) {
    next(error);
  } finally {
    connectionDB.release();
  }
}
export default changePassword;
