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

////////// USERS ROUTES //////////

// [[ ALL POST REQUEST ]]

// create new user
router.post("/register", registerUser);
// do login
router.post("/login", loginUser);
// send a new activation code
router.post("/send-code", sendNewActivationCode);
// recovery the user password if user forgotten
router.get("/recovery-password", recoverPassword);

// [[ ALL GET REQUEST ]]
// list all users
router.get("/list", onlyAdmins, getUsers);
// list just one user by id
router.get("/get/:id", onlyAdmins, getUserById);
// Activate the user account
router.get("/:id/activate", activateUser);
// deactivate the user account
router.get("/:id/deactivate/", onlyUsersAuthenticated, deactivateUser);

// [[ ALL PUT REQUEST ]]
// update user data
router.put("/update/:id", onlyUsersAuthenticated, updateUser);
// upload an image file 
router.put("/avatar/:id", onlyUsersAuthenticated, uploadUserImage);

// [[ DELETE REQUEST ]]
router.delete("/delete/:id", onlyAdmins, deleteUser);

export default router;
