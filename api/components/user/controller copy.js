import { v4 as uuidV4 } from "uuid";
import authentication from "../authentication";
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

	async function upsert(clientData) {
		const user = {
			email: clientData.email,
			name: clientData.name,
			surname: clientData.surname,
			telephone: clientData.telephone,
			country: clientData.country,
			city: clientData.city,
		};

		if (!clientData.id) {
			user.id = uuidV4();
		} else {
			user.id = clientData.id;
		}

		if (clientData.password || clientData.email) {
			await authentication.upsert({
				id: user.id,
				email: user.email,
				password: clientData.password,
			});
		}
		console.log("ESTE ES LOS DATOS DEL NUEVO USUARIO::::", user);
		return await store.upsert(TABLE, user);
	}

	return {
		findAll,
		findOne,

		upsert,
	};
}
