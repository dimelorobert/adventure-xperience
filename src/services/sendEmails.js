import { createTransport } from "nodemailer";
import { nodemailerAuthConfig } from "../config";
import { errorGenerator } from "../helpers";

// we send an email with the activation link for user account
async function sendEmail(mailOptions) {
  try {
    const transporter = createTransport(nodemailerAuthConfig);

    transporter.sendMail(mailOptions);

  } catch (error) {
    errorGenerator("Ha ocurrido un error al enviar  el email", 409);
  }
}

export default sendEmail;
