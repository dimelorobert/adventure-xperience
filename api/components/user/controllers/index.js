import createUser from "./createUser";
import getUsers from "./getUsers";
import getUserById from "./getUserById";
import updateUser from "./updateUser";
import deleteUser from "./deleteUser";
import activateUser from "./activateUser";
import deactivateUser from "./deactivateUser";
import sendNewActivationCode from "./newActivationCode";
import recoverPassword from "./recoverPassword";
import uploadUserImage from "./uploadUserImage";
import loginUser from "./loginUser";

const userControllers = {
	getUsers,
	getUserById,
	updateUser,
	deleteUser,
	activateUser,
	deactivateUser,
	sendNewActivationCode,
	recoverPassword,
	uploadUserImage,
	loginUser,
	createUser,
};
export default userControllers;
