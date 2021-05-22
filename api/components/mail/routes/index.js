import routerx from "express-promise-router";
import { send } from "./functions-routes";

const router = routerx();

router.post("/send", send);

export default router;
