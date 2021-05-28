import path from "path";
import config from "../../../config";

const imagePathEmail = path.join(
	__dirname,
	`../../../${config.pathFiles.logo}`,
);

const newCodeUserMail = ({ id, email, activation_code }) => {
	const { host, port, routes } = config.api;

	const activationLink = `${host}:${port}/${routes.user}/${id}/activate?code=${activation_code}`;

	return {
		from: `Aventura Xperience <${config.nodemailer.admin_email}>`,
		to: `${email}`,
		subject: `🔑 Nuevo codigo de activación para tu cuenta en Aventura xperience `,
		text: `Hemos generado un nuevo código de activación para tu cuenta`,
		html: `<div>
               		<img src="cid:logo"/>
               		<h2>👋 Hola aventurero!</h2>
               		<p>Te hemos generado un nuevo codigo para activar tu cuenta,</p>
               		<p>en Aventura Xperience.</p>
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
               		<p>Recuerda que tambien puedes copiar el link y pegarlo en la barra de direcciones</p>
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

export default newCodeUserMail;
