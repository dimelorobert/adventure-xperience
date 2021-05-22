import auth from "../../../auth";
import bcrypt from "bcrypt";

const TABLE = "authentication";

export default function (injectedStore) {
	let store = injectedStore;
	if (!store) {
		store = require("../../../database/dummy");
	}

	async function login(email, password) {
		const data = await store.query(TABLE, { email: email });
		console.log("ESTA ES LA DATA:::",data)

		const checkPassword = await bcrypt.compare(password, data.password)
		if (checkPassword === true) {
			// generate token
			const token = auth.sign(data);
			console.log("ESTE ES EL TOKEN:::", token);
			return token;
		} else {
			throw new Error("Datos Incorrectos");
		}
	}

	async function upsert(userData) {
		const authenticationData = {
			id: userData.id,
		};

		if (userData.email) {
			authenticationData.email = userData.email;
		}
		if (userData.password) {
			authenticationData.password = await bcrypt.hash(userData.password, 10);
		}
		return store.upsert(TABLE, authenticationData);
	}

	return {
		upsert,
		login,
	};
}
