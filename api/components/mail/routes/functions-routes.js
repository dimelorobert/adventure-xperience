import controller from "..";
import response from "../../../../routes/response";

export const send = (req, res) => {
	controller
		.send(req.body)
		.then(email => {
			return response.success(req, res, email, 200);
		})
		.catch(error => {
			response.error(req, res, error.message, 500);
		});
};
