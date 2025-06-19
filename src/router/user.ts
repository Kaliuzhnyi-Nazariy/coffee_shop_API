import { Router } from "express";
import ctrl from "../controllers/user";
import isAuth from "../middlewares/isAuth";

const router = Router();

router.get("/", isAuth, ctrl.getUser);

router.put("/update", isAuth, ctrl.updateUser);

router.patch("/:goodId", isAuth, ctrl.addFavorites);

router.patch("/:goodId/remove", isAuth, ctrl.removeFavorites);

router.delete("/", isAuth, ctrl.deleteAccount);

export default router;
