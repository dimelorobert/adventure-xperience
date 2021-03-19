import { createTransport } from "nodemailer";
import config from "../../config";

function sendEmail(mailOptions) {
	try {
		const transporter = createTransport(config.nodemailer);
		transporter.sendMail(mailOptions);
	} catch (error) {
		return error;
	}
}

export default sendEmail;
