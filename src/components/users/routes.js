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


router
	.post("/register", registerUser)

	.post("/login", loginUser)

	.post("/send-code", sendNewActivationCode)

	.post("/recovery-password", recoverPassword)

	.get("/list", getUsers )

	.get("/get/:id", onlyAdmins, getUserById)

	.get("/:id/activate", activateUser)

	.get("/:id/deactivate/", onlyUsersAuthenticated, deactivateUser)

	.put("/update/:id", onlyUsersAuthenticated, updateUser)

	.put("/avatar/:id", onlyUsersAuthenticated, uploadUserImage)

	.delete("/delete/:id", onlyAdmins, deleteUser);


export default router;
