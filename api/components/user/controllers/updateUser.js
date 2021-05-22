import getConnection from "../../../services/database";

// we open connection to db
let connectionDB;
async function updateUser(request, response, next) {
	try {
		// we open connection to db
		connectionDB = await getConnection();

		// we validate data

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
	} catch (error) {
		next(error);
	} finally {
		await connectionDB.release();
	}
}

export default updateUser;
