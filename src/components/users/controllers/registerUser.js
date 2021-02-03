// required modules to use
import bcrypt from 'bcrypt';
import path from 'path';
import getConnection from '../../../database';
import { v4 as uuidv4 } from 'uuid';
import helpers from '../../../helpers';
import { registerSchema } from '../validations';
import { sendEmail } from '../../../services';

// uploading global variables to use
const {
   ADMIN_EMAIL,
   PUBLIC_HOST,
   FIRST_DEFAULT_PORT,
   LOGO_IMAGE_PATH,
} = process.env;

// we open connection to db
let connectionDB;

async function registerUser(request, response, next) {
   try {
      // open connection to db
      connectionDB = await getConnection();

      // validate data from request body
      await registerSchema.validateAsync(request.body);

      const { email, password } = request.body;

      // we check if email already exist
      const [emailExist] = await connectionDB.query(
         `SELECT email FROM users WHERE email=?`,
         [email]
      );
      if (emailExist.length) {
         console.log('[ERROR] registerUser.js line:46');
         return response.status(404).json({
            message: 'El email ya esta registrado',
         });
      }

      // formatted object to save into db
      const newUser = {
         id: uuidv4(),
         email: email,
         password: await bcrypt.hash(password, 10),
         activation_code: helpers.randomString(20),
         ip: request.ip,
      };

      // save data into db
      await connectionDB.query(`INSERT INTO users SET ?`, newUser);

      // build an activation link
      const userActivationLink = `${PUBLIC_HOST}:${FIRST_DEFAULT_PORT}/users/${newUser.id}/activate?code=${newUser.activation_code}`;

      // build logo path
      const imagePathEmail = path.join(
         __dirname,`../../../${LOGO_IMAGE_PATH}`,
      );

      // build email to send
      const mailOptions = {
         from: ADMIN_EMAIL,
         to: `${email}`,
         subject: `⚠️ Confirma el email en Aventura xperience `,
         text: `Muchas gracias por registrarte.`,
         html: `
            <div>
               <img src="cid:logo"/>              
               <p>Hola aventurero!</p>
               <p>Para poder tener acceso a tu cuenta en Aventura Xperience,
               necesitamos que confirmes este email con el siguiente email</p>            
				   <a style="
					  padding: 0.5rem 1rem;
					  color: white;
					  background - color: #FF235B;
					  border-radius: 0.25rem
					  "
					  href="${userActivationLink}" target="_blank">Confirmar Cuenta</a>
            </div>`,
         attachments: [
            {
               filename: 'logo.png',
               path: imagePathEmail,
               cid: 'logo',
            },
         ],
      };

      // we send email with link activation
      await sendEmail(mailOptions);

      // if everything it's ok we sen a json
      response.status(201).send({
         message: 'El usuario se ha creado con éxito, revisa tu correo',
      });

   } catch (error) {
      
      // if db is not created throw this error
      if (error.code === 'ER_BAD_DB_ERROR') {
         console.log('[ERROR] registerUser.js line:117');
         return response.status(500).send({
            message: 'Ha ocurrido un error en el servidor',
         });
      }

      // else error default
      console.log('[ERROR] registerUser.js line:124');
      next(error);
   } finally {
      // we close connection
      if (connectionDB) await connectionDB.release();
   }
}

export default registerUser;
