// required modules to use
/*import getConnection from '../../../database';

// we define the variable to connect to db
let connectionDB;*/
import userModel from "../userModel";

async function getUsers(request, response, next) {
	try {
		/*// open connection to db
		connectionDB = await getConnection();

		// we build a SQL query to list all users
		const [userList] = await connectionDB.query("SELECT * FROM users;");
		if (!userList) {
			return response.status(400).send({ message: "No hay resultados" });
		}*/

		const users = await userModel.find();

		// if everything it's ok we sen a json
		response.status(200).json({
			data: users,
		});
	} catch (error) {
		console.log("[ERROR] line:23 ");
		next(error);
	} /* finally {
		if (!connectionDB) await connectionDB.release();
	}*/
}

export default getUsers;
