// required modules to use
import getConnection from '../../../database';
import { sendEmail } from '../../../services';
import path from 'path';

// we open connection to db
let connectionDB;

// uploading global variables to use
const { ADMIN_EMAIL, LOGO_IMAGE_PATH, SIGNIN_LINK } = process.env;

async function activateUser(request, response, next) {
   try {
      // open connection to db
      connectionDB = await getConnection();

      // catching the user id from params
      const { id } = request.params;

      // check if code was already used
      const [
         activationCode,
      ] = await connectionDB.query(
         `SELECT activation_code, email, password FROM users WHERE id=?`,
         [id],
      );
      if (activationCode[0].activation_code === null) {
         return response.status(400).send({
            message: 'El link de activación ya ha sido utilizado',
         });
      }

      // updating the state account to activated and remove activation code
      await connectionDB.query(
         `UPDATE users 
			SET is_account_active=1, activation_code=NULL 
			WHERE id=? `,
         [id],
      );

      // build email logo path
      const imagePathEmail = path.join(
         __dirname,
         `../../../${LOGO_IMAGE_PATH}`,
      );

      // build email to send
      const mailOptions = {
         from: ADMIN_EMAIL,
         to: `${activationCode[0].email}`,
         subject: `✅ Cuenta Aventura Xperience activada`,
         text: `Ya puedes acceder a tu cuenta y disfrutar de las experiencias que más te gusten!`,
         html: `
            <div>
				  <img src="cid:logo" alt="logo">
				  <h2>🎉WooHoo!!</h2>
              <h3>👋 Bienvenido a Aventura Xperience, aventurero!</h3>
				  <p>Puedes iniciar sesión en tu cuenta dando click en el siguiente enlace:</p>
				  <br>           
				   <a style="
					  padding: 0.5rem 1rem;
					  color: white;
					  background-color: #FF235B;
                 border-radius: 0.25rem;
                 text-decoration: none;
                 margin: 1rem 0;
                 font-weight: 600;
					  "
                 href="${SIGNIN_LINK}" target="_blank">
                 Iniciar sesión
               </a>
               <br>
               <br>
            </div>`,
         attachments: [
            {
               filename: 'logo.png',
               path: imagePathEmail,
               cid: 'logo', // cid value as in the html img src
            },
         ],
      };

      // we send email activated account
      await sendEmail(mailOptions);

      // if everything it's ok we sen a json
      response.status(200).send({ message: 'Cuenta activada' });
   } catch (error) {
      next(error);
   } finally {
      // we close connection
      if (connectionDB) await connectionDB.release();
   }
}
export default activateUser;
