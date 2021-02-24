import routerx from "express-promise-router";
import {
	registerUser,
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
} from "./controllers";
import { onlyUsersAuthenticated, onlyAdmins } from "../../middlewares";


const router = routerx();

// USERS ROUTES

// [[ ALL POST REQUEST ]]

// create new user
router
	.post("/register", registerUser)
	// do login
	.post("/login", loginUser)
	// send a new activation code
	.post("/send-code", sendNewActivationCode)
	// recovery the user password if user forgotten
	.post("/recovery-password", recoverPassword)

	// [[ ALL GET REQUEST ]]
	// list all users
	.get("/list", getUsers )
	// list just one user by id
	.get("/get/:id", onlyAdmins, getUserById)
	// Activate the user account
	.get("/:id/activate", activateUser)
	// deactivate the user account
	.get("/:id/deactivate/", onlyUsersAuthenticated, deactivateUser)

	// [[ ALL PUT REQUEST ]]
	// update user data
	.put("/update/:id", onlyUsersAuthenticated, updateUser)
	// upload an image file
	.put("/avatar/:id", onlyUsersAuthenticated, uploadUserImage)

	// [[ DELETE REQUEST ]]
	.delete("/delete/:id", onlyAdmins, deleteUser);

export default router;
