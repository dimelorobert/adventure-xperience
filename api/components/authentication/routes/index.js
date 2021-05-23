import routerx from "express-promise-router";

import { login } from "./functions-routes";

const router = routerx();

router.post("/login", login);

export default router;
