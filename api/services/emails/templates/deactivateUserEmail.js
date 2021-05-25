import path from "path";
import config from "../../../config";

const imagePathEmail = path.join(
	__dirname,
	`../../../${config.pathFiles.logo}`,
);

const activateMail = ({ id, email, activation_code }) => {

	return {
		from: `Aventura Xperience <${config.nodemailer.admin_email}>`,
		to: `${email}`,
		subject: `😴 Tu cuenta en Aventura xperience ha sido desactivada`,
		text: `Te mereces un descanso, aventurero!`,
		html: `<div>
               		<img src="cid:logo"/>              
               		<h2>😴 Te mereces un descanso, aventurero!</h2>
               		<p>Entendemos que necesites un descanso despues de tantas aventuras y experiencias vividas con nosotros</p>
							<p>Recuerda que puedes reactivar tu cuenta solicitando un nuevo codigo de activacion</p>
               		<br>
               		<br>
               	<a style="
								padding: 0.5rem 1rem;
								color: white;
								background-color: #ff235b;
								border-radius: 0.25rem;
								text-decoration: none;
								margin: 1rem 0;
								font-weight: 600; 
							" href="#" target="_blank">
                 		Solicitar codigo
               		</a>
							<br>
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
}
export default activateMail;
