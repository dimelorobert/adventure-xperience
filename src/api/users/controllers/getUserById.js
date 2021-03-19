import userModel from "../dao";

async function getUserById(request, response, next) {
	try {
		const { id } = request.params;

		const result = await userModel.findOne({ id });

		if (!result) {
			return response.status(404).json({
				message: `El usuario no existe, por favor intentalo de nuevo`,
			});
		}

		response.status(200).json(result);
	} catch (error) {
		next(error);
	}
}
export default getUserById;
