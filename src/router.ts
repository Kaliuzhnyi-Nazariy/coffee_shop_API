import { Router } from "express";
import authRouter from "./router/auth";
import userRouter from "./router/user";
import orderRouter from "./router/order";
import cartRouter from "./router/cart";
import wishlistRouter from "./router/wishlist";
import { errorRouter } from "./router/error";

const router = Router();

router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);
router.use("/api/order", orderRouter);
router.use("/api/cart", cartRouter);
router.use("/api/wishlist", wishlistRouter);

router.use(errorRouter);

export default router;
