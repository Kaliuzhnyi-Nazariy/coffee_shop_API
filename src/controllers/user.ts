//todo
//get user
//update user
//delete account
//add favorites
//remove favorites
//add payment method
//remove payment method

import { Request, Response } from "express-serve-static-core";
import {
  CreateUser,
  ExtendedUser,
  IUser,
  PaymentMethod,
  UserFinal,
  UserResult,
} from "../models/typesOrInterfaces/user";
import helper from "../helper";
import User from "../models/user.model";
import * as argon from "argon2";

const getUser = async (req: Request, res: Response<UserResult>) => {
  const userData = (req as unknown as ExtendedUser).user;
  res.status(200).json(userData);
};

const updateUser = async (
  req: Request<{}, {}, Partial<CreateUser>>,
  res: Response<UserResult>
) => {
  const { _id } = (req as unknown as ExtendedUser).user;
  const newData = req.body;

  const isUser = await User.findById(_id).select("-password");

  if (!isUser) return helper.errorHandler(401);

  let newPassword = "";

  if (newData.password) {
    newPassword = await argon.hash(newData.password);
  }

  const newUserData = await User.findByIdAndUpdate<UserResult>(
    _id,
    {
      $set: {
        ...newData,
        password: newPassword,
      },
    },
    { new: true }
  ).select("-password");

  if (!newUserData) return helper.errorHandler(500);

  return res.status(200).json(newUserData);
};

const deleteAccount = async (req: Request, res: Response) => {
  const { _id } = (req as unknown as ExtendedUser).user;

  const isUser = await User.findById(_id).select("-password");

  if (!isUser) return helper.errorHandler(404, "User not found!");

  await User.findByIdAndDelete(_id);

  return res
    .clearCookie("token", {
      sameSite: "none",
      httpOnly: true,
      // sameSite: "lax",
      secure: true,
      path: "/",
    })
    .status(200)
    .json(isUser);
};

const addFavorites = async (req: Request, res: Response<UserFinal>) => {
  const { _id } = (req as unknown as ExtendedUser).user;
  const { goodId } = req.params;

  const user = await User.findById(_id).select("-password");

  if (!user) return helper.errorHandler(400, "User not found!");

  const checkIfGoodInFavorites = () => {
    return user.favorites?.includes(goodId) ?? false;
  };

  if (checkIfGoodInFavorites())
    return helper.errorHandler(400, "Good already in favorites!");

  const userWithNewFavorite = await User.findByIdAndUpdate(
    _id,
    { $push: { favorites: goodId } },
    { new: true }
  ).select("-password");

  if (!userWithNewFavorite) return helper.errorHandler(500);

  const safeUser: UserFinal = {
    ...userWithNewFavorite.toObject(),
    favorites: userWithNewFavorite.favorites ?? [],
  };

  return res.status(200).json(safeUser);
};

const removeFavorites = async (req: Request, res: Response<UserFinal>) => {
  const { _id } = (req as unknown as ExtendedUser).user;
  const { goodId } = req.params;

  const user = await User.findById(_id).select("-password");

  if (!user) return helper.errorHandler(400, "User not found!");

  const checkIfGoodInFavorites = () => {
    return user.favorites?.includes(goodId);
  };

  if (!checkIfGoodInFavorites())
    return helper.errorHandler(400, "Good already not in favorites!");

  const userWithNewFavorite = await User.findByIdAndUpdate(
    _id,
    { $pull: { favorites: goodId } },
    { new: true }
  ).select("-password");

  if (!userWithNewFavorite) return helper.errorHandler(500);

  const safeUser: UserFinal = {
    ...userWithNewFavorite.toObject(),
    favorites: userWithNewFavorite.favorites ?? [],
  };

  return res.status(200).json(safeUser);
};

const addPaymentSystem = async (req: Request, res: Response) => {
  const { type } = req.body;

  const newPayment = {} as PaymentMethod;

  if (type === "card") {
  } else {
  }
};

export default {
  getUser: helper.ctrlWrapper(getUser),
  updateUser: helper.ctrlWrapper(updateUser),
  deleteAccount: helper.ctrlWrapper(deleteAccount),
  addFavorites: helper.ctrlWrapper(addFavorites),
  removeFavorites: helper.ctrlWrapper(removeFavorites),
};
