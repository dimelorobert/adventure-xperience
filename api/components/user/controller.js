import { v4 as uuidV4 } from "uuid";
import helpers from "../../../utils/helpers";
import authentication from "../authentication";
import sendEmail from "../../services/emails";
import emailTemplates from "../../services/emails/templates";
const TABLE = "users";

export default function (injectedStore) {
	let store = injectedStore;
	if (!store) {
		store = require("../../../database/dummy");
		console.log("esto es el store", store);
	}

	async function findAll() {
		return store.findAll(TABLE);
	}

	async function findOne(id) {
		return store.findOne(TABLE, { id: id });
	}

	async function update(body, id) {
		const userDataDB = await store.findOne(TABLE, { id: id });

		const user = {
			name: body.name || userDataDB.name,
			surname: body.surname || userDataDB.surname,
			address: body.address || userDataDB.address,
			telephone: body.telephone || userDataDB.telephone,
			country: body.country || userDataDB.country,
			city: body.city || userDataDB.city,
		};

		return store.update(TABLE, user, { id: id });
	}

	async function create(body) {
		const user = {
			id: uuidV4(),
			email: body.email.toLowerCase().trim(),
			activation_code: helpers.randomString(20),
		};

		if (body.email && body.password) {
			await authentication.upsert({
				id: user.id,
				email: user.email,
				password: body.password,
			});
		}

		const mailOptions = emailTemplates.new_user(user);
		await sendEmail(mailOptions);

		return await store.create(TABLE, user);
	}

	async function updateUser() {
		const { id } = request.params;
		const { name, surname, address, telephone, city, country } = request.body;

		// we check if user exist
		const [
			userExist,
		] = await connectionDB.query(`SELECT id FROM users WHERE id=?`, [id]);
		if (!userExist.length) {
			return response.status(404).send({ message: "El usuario no existe" });
		}

		// we create an user object to save into db
		const user = {
			id: id,
			name: name,
			surname: surname,
			address: address,
			telephone: telephone,
			city: city,
			country: country,
			update_at: new Date(),
		};

		// we save data into db
		await connectionDB.query(`UPDATE users SET ?`, user);

		response.status(200).send({ message: "Usuario actualizado" });
	}

	return {
		findAll,
		findOne,
		create,
		update,
	};
}
