import path from "path";
import config from "../../../config";

const imagePathEmail = path.join(
	__dirname,
	`../../../${config.pathFiles.logo}`,
);

const activateMail = ({ email }) => {
	return {
		from: config.nodemailer.admin_email,
		to: email,
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
                 href="#" target="_blank">
                 Iniciar sesión
               </a>
               <br>
               <br>
            </div>`,
		attachments: [
			{
				filename: "logo.png",
				path: imagePathEmail,
				cid: "logo", // cid value as in the html img src
			},
		],
	};
};
export default activateMail;
