import nodemailer from "nodemailer";
import "dotenv/config";

const {
  ADMIN_EMAIL,
  PASSWORD_ADMIN_EMAIL,
  SERVICE_EMAIL
} = process.env;



// we send an email with the activation link for user account
async function sendEmail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      service: SERVICE_EMAIL,
      auth: {
        user: ADMIN_EMAIL,
        pass: PASSWORD_ADMIN_EMAIL,
      },
    });
    mailOptions = {
      from: "no-reply@gmail.com",
      to: `${mailOptions.to}`,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
    };

    transporter.sendMail(mailOptions, () => {
      console.log("El email fue enviado");
    });
  } catch (error) {
    console.log(error);
    if (error) {
      console.log("Hubo un error al enviar el email");
    }
  }
}

export default sendEmail;
