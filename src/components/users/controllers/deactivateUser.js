import getConnection from "../../../database";
import sendEmail from '../../../services'

// we open connection to db
let connectionDB;

async function deactivateUser(request, response, next) {
  // we open connection to db and get user id and code activation
  connectionDB = await getConnection();
  try {
    const { id } = request.params;

    const [
      isAccountActive,
    ] = await connectionDB.query(
      `SELECT is_account_active, email FROM users WHERE id=?`,
      [id]
    );

    if (isAccountActive[0].is_account_active === 0) {
      return response
        .status(400)
        .send({ message: "La cuenta ya esta desactivada" });
    }

    // we build a SQL query to update and to activate the user account
    await connectionDB.query(
      `
        UPDATE users
        SET is_account_active=0
        WHERE id=?`,
      [id]
     );
     
     const mailOptions = {
       from: "no-reply@gmail.com",
       to: `${isAccountActive[0].email}`,
       subject: `Cuenta Aventura Xperience ha sido dada de baja`,
       text: `Se ha procedido a eliminacion de tu cuenta`,
       html: `
            <div>
              <img src="cid:logo" alt="logo">
              <h1>Cuenta Aventura Xperience dada de baja</h1>
              <p>Hola!</p>
              <p>Hemos procedido a dar la baja de tu cuenta Aventura Xperience</p>
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

    response.status(200).send({ message: "Cuenta desactivada" });
  } catch (error) {
    next(error);
  } finally {
    connectionDB.release();
  }
}

export default deactivateUser;
