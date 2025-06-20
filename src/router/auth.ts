import { Router } from "express";
import ctrl from "../controllers/auth";
import middleware from "../middlewares";
import validation from "../models/validatons/user";

const router = Router();

router.post(
  "/signup",
  middleware.validator(validation.createUserValidation),
  ctrl.signUp
);
router.post(
  "/signin",
  middleware.validator(validation.loginValidation),
  ctrl.signIn
);
router.post("/logout", middleware.isAuth, ctrl.logout);

export default router;
