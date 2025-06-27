import { Router } from "express";
import ctrl from "../controllers/wishlist";
import middleware from "../middlewares";

const router = Router();

router.post("/add", middleware.isAuth, ctrl.addToWishlist);

router.delete("/delete/:goodId", middleware.isAuth, ctrl.removeFromWishlist);

export default router;
