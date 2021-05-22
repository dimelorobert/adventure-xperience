// abstraction DB
const database = {
	user: [
		{
			id: "qwerty",
			email: "airbusjayrobert@gmail.com",
			password: "123456",
		},
		{
			id: "2",
			email: "Soy Groot",
			password: "123456",
		},
	],
};
//console.log("ESTA ES LA BASE DE DATOS:::::",database);
const store = {
	findAll: async table => {
		return database[table] || null;
	},

	findOne: async (table, id) => {
		let collection = await store.findAll(table);
		let foundData = collection.filter(item => item.id === id)[0] || null;
		return foundData;
	},

	upsert: async (table, data) => {
		if (!database[table]) {
			database[table] = [];
		}

		database[table].push(data);
	},

	remove: async (table, id) => {
		return true;
	},

	query: async (table, rowName) => {
		// array collection
		let collection = await store.findAll(table);

		let keyRowName = Object.keys(rowName)[0];

		return (
			collection.filter(
				tableDB => tableDB[keyRowName] === rowName[keyRowName],
			)[0] || null
		);
	},
};

export default store;
