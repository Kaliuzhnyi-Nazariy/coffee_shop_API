import { Router } from "express";
import ctrl from "../controllers/cart";
import middleware from "../middlewares";

const router = Router();

router.put("/addtocart", middleware.isAuth, ctrl.addToCart);

router.put("/remove/:goodId", middleware.isAuth, ctrl.removeFromCart);

export default router;
