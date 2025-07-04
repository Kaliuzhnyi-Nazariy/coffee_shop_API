import { Request, Response } from "express-serve-static-core";
import User from "../models/user.model";
import helper from "../helper";
import * as argon from "argon2";
import {
  CreateUser,
  ExtendedUser,
  IUser,
  LogUser,
  UserResult,
} from "../models/typesOrInterfaces/user";
import * as jwt from "jsonwebtoken";

const { SECRET_JWT } = process.env;

const signUp = async (
  req: Request<{}, {}, CreateUser>,
  res: Response<UserResult>
) => {
  const { name, password, phoneNumber, location } = req.body;

  if (!name || !password || !phoneNumber || !location)
    return helper.errorHandler(400, "Wrong credentials!");

  const isUser = await User.findOne({ phoneNumber: req.body.phoneNumber });
  if (isUser)
    return helper.errorHandler(409, "This credentials already in use!");

  const hashedPassword = await argon.hash(req.body.password);

  const newUser = {
    ...req.body,
    password: hashedPassword,
  };

  const createdUser = await User.create(newUser);

  const payload = {
    id: createdUser._id,
  };

  const token = jwt.sign(payload, SECRET_JWT as string);

  return res
    .cookie("token", token, {
      sameSite: "none",
      httpOnly: true,
      // sameSite: "lax",
      secure: true,
      path: "/",
    })
    .status(201)
    .json({
      _id: createdUser._id,
      name: createdUser.name,
      phoneNumber: createdUser.phoneNumber,
      favorites: [],
      location: createdUser.location,
      paymentMethods: [],
      cart: [],
    });
};

const login = async (
  req: Request<{}, {}, LogUser>,
  res: Response<UserResult>
) => {
  const { phoneNumber, password } = req.body;

  const user = await User.findOne({ phoneNumber });

  if (!user) return helper.errorHandler(401);

  const isPasswordCorrect = await argon.verify(user.password, password);
  if (!isPasswordCorrect)
    return helper.errorHandler(400, "Wrong phone number or password!");

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_JWT as string);

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    })
    .json({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      favorites: user.favorites || [],
      location: user.location,
      paymentMethods: user.paymentMethods,
    });
};

const logout = async (
  req: Request<{}, {}, IUser>,
  res: Response<{ message: string }>
) => {
  return res
    .clearCookie("token", {
      sameSite: "none",
      httpOnly: true,
      // sameSite: "lax",
      secure: true,
      path: "/",
    })
    .status(200)
    .json({ message: "Successfully logged out!" });
};

export default {
  signUp: helper.ctrlWrapper(signUp),
  signIn: helper.ctrlWrapper(login),
  logout: helper.ctrlWrapper(logout),
};
