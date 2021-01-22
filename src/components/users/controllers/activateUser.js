import getConnection from "../../../database";
import sendEmail from "../../../services";

// we open connection to db
let connectionDB;

async function activateUser(request, response, next) {
  // we open connection to db and get user id and code activation
  connectionDB = await getConnection();
  try {
    const { id } = request.params;
    const { code } = request.query;

    const [
      activationCode,
    ] = await connectionDB.query(
      `SELECT activation_code, email FROM users WHERE id=?`,
      [id]
    );

    if (
      activationCode[0].activation_code === null ||
      activationCode[0].activation_code !== code
    ) {
      return response.status(400).send({
        message: "No se ha podido activar la cuenta o ya esta activada",
      });
    }

    // we build a SQL query to update and to activate the user account
    await connectionDB.query(
      `
        UPDATE users
        SET is_account_active=1, activation_code=NULL
        WHERE id=? `,
      [id]
    );

    const mailOptions = {
      from: "no-reply@gmail.com",
      to: `${activationCode[0].email}`,
      subject: `Cuenta Aventura Xperience activada`,
      text: `Ya puedes iniciar sesión`,
      html: `
            <div>
              <img src="cid:logo" alt="logo">
              <h1>Cuenta Aventura Xperience activada</h1>
              <p>Hola!</p>
              <p>Puedes iniciar sesión en tu cuenta</p>
            </div>`,
      attachments: [
        {
          filename: "logo.png",
          path: "/src/public/uploads/logo/logo.png",
          cid: "logo", // cid value as in the html img src
        },
      ],
    };

    await sendEmail(mailOptions);

    response.status(200).send({ message: "Cuenta activada" });
  } catch (error) {
    next(error);
  } finally {
    connectionDB.release();
  }
}

export default activateUser;
