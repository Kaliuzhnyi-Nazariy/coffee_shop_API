import { Router } from "express";
import ctrl from "../controllers/user";
import isAuth from "../middlewares/isAuth";
import middlewares from "../middlewares";
import validation from "../models/validatons";

const router = Router();

router.get("/", isAuth, ctrl.getUser);

router.put(
  "/update",
  middlewares.validator(validation.createUserValidation.userValidation),
  isAuth,
  ctrl.updateUser
);

router.patch("/:goodId", isAuth, ctrl.addFavorites);

router.patch("/:goodId/remove", isAuth, ctrl.removeFavorites);

router.delete("/", isAuth, ctrl.deleteAccount);

router.post(
  "/addpayment",
  middlewares.validator(validation.paymentValidation),
  isAuth,
  ctrl.addPaymentSystem
);

router.post("/removepayment/:paymentId", isAuth, ctrl.removePayment);

export default router;
