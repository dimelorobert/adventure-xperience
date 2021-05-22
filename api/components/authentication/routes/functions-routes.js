import controller from "..";
import response from "../../../../routes/response";

export const login = (req, res) => {
	console.log("ESTE ES EL LOGIN", req.body )
	controller
		.login(req.body.email, req.body.password)
		.then(token => {
			return response.success(req, res, token, 200);
		})
		.catch(error => {
			response.error(req, res, error.message, 500);
		});
};
