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

// create new user
router.post("/register", registerUser);

// do login 
router.post("/login", loginUser);
router.post("/send-code", sendNewActivationCode);
router.post("/recovery-password", recoverPassword);

router.get("/list", onlyUsersAuthenticated, getUsers);
router.get("/get/:id", getUserById);
router.get("/:id/activate", onlyAdmins, activateUser);
router.get("/:id/deactivate/", onlyUsersAuthenticated, deactivateUser);

router.patch("/update/:id", onlyUsersAuthenticated, updateUser);
router.patch("/avatar/:id", onlyUsersAuthenticated, uploadUserImage);

router.delete("/delete/:id", onlyAdmins, deleteUser);

export default router;
