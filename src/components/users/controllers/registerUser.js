import getConnection from "../../../database";
import { createSchema } from "../validations";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import helpers from "../../../helpers";
import { sendEmail } from "../../../services";
import path from "path";

const { PUBLIC_HOST, FIRST_DEFAULT_PORT } = process.env;

// we open connection to db
let connectionDB;

export async function registerUser(request, response, next) {
  try {
    // we open connection to db
    connectionDB = await getConnection();

    // we validate the data received from request body
    await createSchema.validateAsync(request.body);
    const { email, password } = request.body;

    const [
      emailExist,
    ] = await connectionDB.query(`SELECT id FROM users WHERE email=?`, [email]);
    if (emailExist) {
      return response
        .status(404)
        .json({ message: "El email ya esta registrado" });
    }

    // we create an user object to save into db
    const newUser = {
      id: uuidv4(),
      email: email,
      password: await bcrypt.hash(password, 10),
      activation_code: helpers.randomString(20),
      ip: request.ip,
    };

    // we save all data into db
    await connectionDB.query(`INSERT INTO users SET ?`, newUser);

    // we build a activation link
    const userActivationLink = `${PUBLIC_HOST}:${FIRST_DEFAULT_PORT}/users/${newUser.id}/activate?code=${newUser.activation_code}`;
    const imagePathEmail = path.join(
      __dirname,
      "../../../public/uploads/logo/logo.png"
    );
    console.log("IMAGE PATH EMAIL::::", imagePathEmail);

    // we create a html structure of our message
    const mailOptions = {
      from: "no-reply@gmail.com",
      to: `${email}`,
      subject: `Activa tu cuenta Aventura Xperience`,
      text: `Confirma tu cuenta para poder acceder con tus datos`,
      html: `
            <div>
              Embedded image: <img src="no-reply@gmail.com"/>
              <h1>Nueva cuenta Aventura Xperience</h1>
              <p>Hola!</p>
              <p>Confirma tu cuenta dando click en el siguiente enlace:</p>            
              <a href="${userActivationLink}" target="_blank">CONFIRMAR CUENTA</a>
              <p>Usuario: ${email}</p>
              <p>Password: ${password}</p>
            </div>`,
      attachments: [
        {
          filename: "logo.png",
          path: imagePathEmail,
          cid: "no-reply@gmail.com",
        },
      ],
    };

    // we send email with link activation
    await sendEmail(mailOptions);

    response.status(200).send({
      message: "El usuario se ha creado con éxito, revisa tu correo",
    });
  } catch (error) {
    next(error);
  } finally {
    await connectionDB.release();
  }
}

