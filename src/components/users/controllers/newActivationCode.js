import getConnection from "../../../database";
import helpers from "../../../helpers";
import { sendEmail } from "../../../services";

const { ADMIN_EMAIL, PUBLIC_HOST, FIRST_DEFAULT_PORT } = process.env;

// we open connection to db
let connectionDB;

async function sendNewActivationCode(request, response, next) {
  try {
    const { email } = request.body;

    // we open connection to db
    connectionDB = await getConnection();

    // we verify if user account is active
    const [isActivate] = await connectionDB.query(
      `
        SELECT id, is_account_active, email 
        FROM users 
        WHERE email=?`,
      [email]
    );

    if (!isActivate.length) {
      return response.status(400).json({ message: `El usuario no existe` });
    }

    if (isActivate[0].is_account_active === 1) {
      return response.status(400).json({
        message: `La cuenta ya esta activada`,
      });
    }

    // code to activate account
    const newCode = helpers.randomString(20);

    // we set reg_code into db
    const [generateNewCode] = await connectionDB.query(
      `
        UPDATE users
        SET activation_code=?
        WHERE email=?`,
      [newCode, email]
    );

    if (!generateNewCode.affectedRows === 0) {
      return response.status(400).json({
        message: `No se pudo generar un nuevo codigo de activación ,`,
      });
    }

    // we send an email with the activation link for user account
    const userValidationLink = `${PUBLIC_HOST}:${FIRST_DEFAULT_PORT}/users/${isActivate[0].id}/activate?code=${newCode}`;

    const mailOptions = {
      from: ADMIN_EMAIL,
      to: `${email}`,
      subject: `Nuevo codigo de activación cuenta Aventura Xperience`,
      text: `Para validar la cuenta pega esta URL en tu navegador : ${userValidationLink}`,
      html: `
            <div>
              <img src="cid:logo" alt="Logo Aventura Xperience">
              <h1> Nuevo codigo de activación cuenta en Aventura Xperience </h1>
              <p> Para validar la cuenta pega esta URL en tu navegador: ${userValidationLink} o pulsa click en el siguiente enlace:
              <a href="${userValidationLink}" target="_blank">Activa tu cuenta dando click aquí!</a>
              </p>
            </div>`,
    };

    await sendEmail(mailOptions);

    // if everything ok, we send all data to json format
    response.status(200).send({
      message: `Se ha enviado un nuevo codigo, verifica tu buzón de correo para activar tu cuenta.`,
    });
  } catch (error) {
    next(error);
  } finally {
    connectionDB.release();
  }
}
export default sendNewActivationCode;
