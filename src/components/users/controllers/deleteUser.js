import getConnection from "../../../database";
import { sendEmail } from "../../../services";

// we open connection to db
let connectionDB;

export async function deleteUser(request, response, next) {
  connectionDB = await getConnection();
  try {
    const { id } = request.params;

    const [
      userExist,
    ] = await connectionDB.query(`SELECT id, email FROM users WHERE id=?`, [
      id,
    ]);
    if (!userExist.length) {
      return response.status(404).send({ message: "El usuario no existe" });
    }

    await connectionDB.query(`DELETE FROM users WHERE id=? `, [id]);

    const mailOptions = {
      from: "no-reply@gmail.com",
      to: `${userExist[0].email}`,
      subject: `Cuenta Aventura Xperience eliminada`,
      text: `Se ha procedido a eliminacion de tu cuenta`,
      html: `
            <div>
              <img src="cid:logo" alt="logo">
              <h1>Cuenta Aventura Xperience eliminada</h1>
              <p>Hola!</p>
              <p>Hemos eliminado tu cuenta Aventura Xperience</p>
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

    response.status(200).send({ message: "Usuario eliminado" });
  } catch (error) {
    response.status(404).send({ message: "No se pudo eliminar el usuario" });
  } finally {
    await connectionDB.release();
  }
}
