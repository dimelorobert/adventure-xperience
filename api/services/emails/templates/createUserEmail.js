import path from "path";
import config from "../../../config";

const imagePathEmail = path.join(
	__dirname,
	`../../../${config.pathFiles.logo}`,
);

const addMail = ({ id, email, activation_code }) => {
	const activationLink = `${config.api.host}:${config.api.port}/user/${id}/activate?code=${activation_code}`;

	return {
		from: `Aventura Xperience <${config.nodemailer.admin_email}>`,
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
							" href="${activationLink}" target="_blank">
                 		Confirmar Cuenta
               		</a>
               		<br>
               		<br>
               		<p>Tambien puedes copiar el link y pegarlo en la barra de direcciones</p>
               		<p>de tu navegador de confiaza para activar la cuenta manualmente:</p> 
               		<pre>${activationLink}</pre> 
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
};

export default addMail;
