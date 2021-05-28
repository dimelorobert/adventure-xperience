import auth from "../../../auth";
import bcrypt from "bcrypt";
import helpers from "../../../utils/helpers";

const TABLE = "authentication";

export default function (injectedStore) {
	let store = injectedStore;
	if (!store) {
		store = require("../../../database/dummy");
	}

	async function login(email, password, ip) {
		//
		const {id, email:dbEmail, password: dbPassword} = await store.findOne(TABLE, { email: email });
console.log("ESTA ES LA IP",ip)

		const checkPassword = await bcrypt.compare(password, dbPassword);
		if (checkPassword === true) {
			// generate token
			const token = auth.sign({id, dbEmail, dbPassword});
			return token;
		} else {
			helpers.errorGenerator("Datos Incorrectos", 409);
		}
	}

	async function upsert(body) {
		const loginData2SaveDB = {
			id: body.id,
		};

		if (body.email && body.password) {
			loginData2SaveDB.email = body.email;
			loginData2SaveDB.password = await bcrypt.hash(body.password, 10);
		}

		return await store.create(TABLE, loginData2SaveDB);
	}

	async function remove(id) {
		return await store.remove(TABLE, id);
	}

	return {
		upsert,
		login,
		remove,
	};
}
