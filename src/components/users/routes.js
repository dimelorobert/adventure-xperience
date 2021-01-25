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

const router = routerx();

router.post("/create", createUser);
router.get("/list", getUsers);
router.get("/get/:id", getUserById);
router.patch("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/:id/activate", activateUser);
router.get("/:id/deactivate/", deactivateUser);
router.post("/send-code", sendNewActivationCode);
router.post("/recovery-password", recoverPassword);
router.put("/avatar/:id", uploadUserImage);
router.post("/login", loginUser);

export default router;
