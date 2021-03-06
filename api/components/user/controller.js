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
	}

	async function create(body) {
		const user = {
			id: uuidV4(),
			email: body.email.toLowerCase().trim(),
			activation_code: helpers.randomString(20),
			image: helpers.randomAvatar(),
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
		const { email } = await store.findOne(TABLE, { id: id });

		//
		const mailOptions = emailTemplates.activate_user({ email: email });
		await sendEmail(mailOptions);
		//
		const userActivation = {
			is_account_active: 1,
			activation_code: null,
		};

		return await store.update(TABLE, userActivation, { id: id });
	}

	async function deactivate(id) {
		//
		const { email } = await store.findOne(TABLE, { id: id });

		//
		const mailOptions = emailTemplates.deactivate_user({ email: email });
		await sendEmail(mailOptions);

		//
		const userDeactivation = {
			is_account_active: 0,
			activation_code: null,
		};

		return await store.update(TABLE, userDeactivation, { id: id });
	}

	async function newCode(email) {
		const userDataDB = await store.findOne(TABLE, { email: email });

		const user = {
			id: userDataDB.id,
			email: email.trim().toLowerCase(),
			activation_code: helpers.randomString(20),
		};

		const mailOptions = emailTemplates.new_code_user(user);
		await sendEmail(mailOptions);

		return await store.update(TABLE, user, { email: user.email });
	}

	return {
		create,
		findAll,
		findOne,
		update,
		remove,
		activate,
		deactivate,
		newCode,
	};
}
