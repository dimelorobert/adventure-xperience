import path from "path";
import config from "../../../config";

const imagePathEmail = path.join(
	__dirname,
	`../../../${config.pathFiles.logo}`,
);

const deleteUserEmail = ({ email }) => {
	return {
		from: `Aventura Xperience <${config.nodemailer.admin_email}>`,
		to: `${email}`,
		subject: `❌ Tu cuenta en Aventura xperience ha sido borrada`,
		text: `Esperamos que este no sea un adios si no, un hasta luego.
		Esperamos verte de nuevo.`,
		html: `<div>
               		<img src="cid:logo"/>              
               		<h2>😭 Hasta la próxima, aventurero!</h2>
               		<p>Esperamos que este no sea un adios si no, un hasta luego.</p>          
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
};

export default deleteUserEmail;
