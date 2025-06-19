import { Router } from "express";
import authRouter from "./router/auth";
import userRouter from "./router/user";
import { errorRouter } from "./router/error";

const router = Router();

router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);

router.use(errorRouter);

export default router;
