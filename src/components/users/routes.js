import routerx from "express-promise-router";
import {
  createUser,
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

router.post("/create", createUser);
router.get("/list", onlyUsersAuthenticated, getUsers);
router.get("/get/:id", getUserById);
router.patch("/update/:id", onlyUsersAuthenticated, updateUser);
router.delete("/delete/:id", onlyAdmins, deleteUser);
router.get("/:id/activate", onlyAdmins, activateUser);
router.get("/:id/deactivate/", onlyUsersAuthenticated, deactivateUser);
router.post("/send-code", sendNewActivationCode);
router.post("/recovery-password", recoverPassword);
router.patch("/avatar/:id", onlyUsersAuthenticated, uploadUserImage);
router.post("/login", loginUser);

export default router;
