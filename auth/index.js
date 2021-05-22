import jwt from "jsonwebtoken";
import config from "../api/config";

function sign(data) {
	return jwt.sign(data, config.jwt.secret_key);
}

function verify(token) {
	return jwt.verify(token, config.jwt.secret_key);
}

const check = {
	own: (req, ownerID) => {
		const decoded = decodeHeader(req);
		console.log("ESTE ES EL DECODED", decoded);

		if (decoded.id !== ownerID) {
			throw new Error("Papi, pilas que no tenés acceso para editar");
		}
	},
};

function getToken(auth) {
	if (!auth) {
		throw new Error("Necesitas token para poder acceder");
	}

	if (auth.indexOf("Bearer ") === -1) {
		throw new Error("El token no tiene un formato correcto");
	}
	let token = auth.replace("Bearer ", "");
	return token;
}

function decodeHeader(req) {
	const authorization = req.headers.authorization || "";
	const token = getToken(authorization);
	const decoded = verify(token);

	req.user = decoded;
	return decoded;
}

export default {
	sign,
	check,
	getToken,
	decodeHeader,
	verify,
};
