import auth from "../../../auth";

export function checkAuth(action) {
	function middleware(req, res, next) {
		switch (action) {
			case "update":
				const ownerID = req.body.id;
				auth.check.own(req, ownerID);
				next();
				break;

			default:
				next();
				break;
		}
	}
	return middleware;
}
export default checkAuth;
