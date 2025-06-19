import { Router } from "express";
import ctrl from "../controllers/auth";
import isAuth from "../middlewares/isAuth";

const router = Router();

router.post("/signup", ctrl.signUp);
router.post("/signin", ctrl.signIn);
router.post("/logout", isAuth, ctrl.logout);

export default router;
