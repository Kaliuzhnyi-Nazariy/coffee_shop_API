import { Router } from "express";
import ctrl from "../controllers/order";
import isAuth from "../middlewares/isAuth";
import middlewares from "../middlewares";
import validatons from "../models/validatons";

const router = Router();

router.post(
  "/",
  isAuth,
  middlewares.validator(validatons.orderValidation),
  ctrl.addOrder
);

export default router;
