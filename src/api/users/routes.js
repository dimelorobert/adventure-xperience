import routerx from "express-promise-router";
import userControllers from "./controllers";
import validations from "./validations";
import { access } from "../../middlewares";

const router = routerx();

router.post("/create", validations.createUserData, userControllers.createUser);

export default router;
