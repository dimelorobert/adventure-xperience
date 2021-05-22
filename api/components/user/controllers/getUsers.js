import userModel from "../dao";

async function getUsers(request, response, next) {
	try {
		
		const users = await userModel.find();
		if (users.length <= 0) {
			return response
				.status(404)
				.send({ message: "No existen usuarios aún" });
		}

		response.status(200).json(users);
	} catch (error) {
		next(error);
	}
}

export default getUsers;
