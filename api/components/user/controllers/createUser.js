// required modules to use
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import helpers from "../../../../utils/helpers";
import emailTemplates from "../../../services/emails/templates";
import sendEmail from "../../../services/emails";
import userDto from "../dto";
import userModel from "../userModel";
import messages from "../../../../utils/helpers/messages/";


let tableName = "users";

async function createUser(request, response, next) {
	try {
		const { email, password } = request.body;

		// user data to save into db
		const user = {
			id: uuidv4(),
			email: email.toLowerCase().trim(),
			password: await bcrypt.hash(password, 10),
			activation_code: helpers.randomString(20),
			ip: request.ip,
		};

		// save data into db
		const createNewUser = await userModel.create(user, tableName);

		if (createNewUser === 0) {
			return response
				.status(500)
				.send({ message: "Ha ocurrido un error al crear el usuario" });
		} else {
			// if everything it's ok we send a json and send email
			const mailOptions = emailTemplates.new_user({
				id: user.id,
				email: user.email,
				activation_code: user.activation_code,
			});
			await sendEmail(mailOptions);

			response.status(201).send(userDto.single(user, messages.userCreated));
		}
	} catch (error) {
		next(error);
	}
}

export default createUser;
