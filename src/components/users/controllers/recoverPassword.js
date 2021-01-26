import getConnection from "../../../database";
import bcrypt from "bcrypt";
import helpers from "../../../helpers";
import { sendEmail } from "../../../services";

// we open connection to db
let connectionDB;

async function recoverPassword(request, response, next) {
  try {
    // we open connection to db
    connectionDB = await getConnection();
    const { email } = request.body;

    // we check if the email exist into db
    const [
      existingUser,
    ] = await connectionDB.query(`SELECT id FROM users WHERE email=?`, [email]);

    if (!existingUser.length) {
      return response.status(400).send({
        message: `No existe ningún usuario asociado al email especificado`,
      });
    }

    const newPass = helpers.randomString(10);

    const newUserPassword = {
      email: email,
      password: await bcrypt.hash(newPass, 10),
    };

    const [result] = await connectionDB.query(
      `UPDATE users SET ? `,
      newUserPassword
    );

    if (!result.affectedRows === 0) {
      return response.status(400).send({
        message: `No se ha podido generar una nueva contraseña`,
      });
    }

    const mailOptions = {
      from: "no-reply@gmail.com",
      to: `${email}`,
      subject: `Restablecer password cuenta Aventura Xperience`,
      text: `Nueva password de acceso`,
      html: `
            <div>
              <h1>Nueva password cuenta Aventura Xperience</h1>
              <p>Hola!</p>
              <p>Te hemos proporcionado una nueva password para que puedas acceder de nuevo a tu cuenta:</p>
              <p>Usuario: ${email}</p>
              <p>Password: ${newPass}</p>
              <p> =====>
              <a href="#" target="_blank">Haz login pulsando click aquí!</a> <=====
              </p>
            </div>`,
    };

    await sendEmail(mailOptions);

    // if everything ok, we send all data to json format
    response.status(200).send({
      message: `Se ha enviado una nueva contraseña a tu email para iniciar sesión.`,
    });
  } catch (error) {
    next(error);
  } finally {
    connectionDB.release();
  }
}

export default recoverPassword;
