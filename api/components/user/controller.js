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

	async function findAll() {
		return store.findAll(TABLE);
	}

	async function findOne(id) {
		return store.findOne(TABLE, { id: id });
	}

	async function update(body, id) {
		//
		const userDataDB = await store.findOne(TABLE, { id: id });

		const user = {
			name: helpers.capitalize(
				(body.name || userDataDB.name).toLowerCase().trim(),
			),
			surname: helpers.capitalize(
				(body.surname || userDataDB.surname).toLowerCase().trim(),
			),
			address: helpers.capitalize(
				(body.address || userDataDB.address).toLowerCase().trim(),
			),
			telephone: body.telephone || userDataDB.telephone,
			country: helpers.capitalize(
				(body.country || userDataDB.country).toLowerCase().trim(),
			),
			city: helpers.capitalize(
				(body.city || userDataDB.city).toLowerCase().trim(),
			),
		};

		return store.update(TABLE, user, { id: id });
	}

	async function remove(id) {
		//
		const { email } = await store.findOne(TABLE, { id: id });

		//
		const mailOptions = emailTemplates.delete_user({ email: email });
		await sendEmail(mailOptions);

		//
		await authentication.remove({ id: id });

		//
		return store.remove(TABLE, { id: id });
	}

	async function activate(id) {
		//
		const userActivation = {
			is_account_active: 1,
			activation_code: "expired",
		};

		return await store.update(TABLE, userActivation, { id: id });
	}

	return {
		create,
		findAll,
		findOne,
		update,
		remove,
		activate,
	};
}
