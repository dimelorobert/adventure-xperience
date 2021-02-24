import routerx from "express-promise-router";
import usersRouter from "./components/users/routes";
import { notFoundErrorHandler, previousErrorHandler } from "./middlewares";

const router = routerx();

router.use("/users", usersRouter);
router.use(previousErrorHandler);
router.use(notFoundErrorHandler);

export default router;
