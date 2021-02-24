// required modules to use
import bcrypt from "bcrypt";
import path from "path";
import getConnection from "../../../database";
import { v4 as uuidv4 } from "uuid";
import helpers from "../../../helpers";
import { registerSchema } from "../validations";
import { sendEmail } from "../../../services";
import logger from "../../../helpers/logger";
import httpCode from "../../../helpers/logger/httpCode";

//
const locationNamefile = path.parse(__filename).base;

// uploading global variables to use
const {
	ADMIN_EMAIL,
	PUBLIC_HOST,
	FIRST_DEFAULT_PORT,
	LOGO_IMAGE_PATH,
} = process.env;

// we define the variable to connect to db
let connectionDB;

export async function registerUser(request, response, next) {
	try {
		// open connection to db
		connectionDB = await getConnection();

		// validate data from request body
		await registerSchema.validateAsync(request.body);

		const { email, password } = request.body;

		// we check if email already exist
		const [
			emailExist,
		] = await connectionDB.query(`SELECT email FROM users WHERE email=?`, [
			email,
		]);

		if (emailExist.length) {
			logger.warning(
				`[${locationNamefile}] || Block code: [emailExist] \n Line [37] Email duplicado en la tabla adventure_db.users: [ ${email} ]`,
			);
			return response.status(httpCode.CONFLICT).send({
				message: "El email ya esta registrado",
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

		// build email logo path
		const imagePathEmail = path.join(
			__dirname,
			`../../../${LOGO_IMAGE_PATH}`,
		);

		// build email to send
		const mailOptions = {
			from: ADMIN_EMAIL,
			to: `${email}`,
			subject: `⚠️ Confirma el email para activar tu cuenta en Aventura xperience `,
			text: `Muchas gracias por registrarte, solo estas a un paso de tener acceso a tu cuenta.`,
			html: `<div>
               		<img src="cid:logo"/>              
               		<h2>👋 Hola aventurero!</h2>
               		<p>Para poder tener acceso a tu cuenta en Aventura Xperience,</p> 
               		<p>necesitas confirmar este email con el siguiente enlace:</p> 
               		<br>           
							<a style="
								padding: 0.5rem 1rem;
								color: white;
								background-color: #ff235b;
								border-radius: 0.25rem;
								text-decoration: none;
								margin: 1rem 0;
								font-weight: 600; 
							" href="${userActivationLink}" target="_blank">
                 		Confirmar Cuenta
               		</a>
               		<br>
               		<br>
               		<p>Tambien puedes copiar el link y pegarlo en la barra de direcciones</p>
               		<p>de tu navegador de confiaza para activar la cuenta manualmente:</p> 
               		<pre>${userActivationLink}</pre> 
               		<br>
					</div>`,
			attachments: [
				{
					filename: "logo.png",
					path: imagePathEmail,
					cid: "logo",
				},
			],
		};

		// we send email with link activation
		await sendEmail(mailOptions);

		// if everything it's ok we sen a json
		response.status(httpCode.CREATED).json({
			message: "El usuario se ha creado con éxito, revisa tu correo",
		});
		logger.success("Usuario creado");
	} catch (error) {
		logger.LogDanger("errror meu");
		next(error);
	} finally {
		// we close connection
		if (connectionDB) await connectionDB.release();
	}
}

//export default registerUser;
