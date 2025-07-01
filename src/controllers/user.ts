import { Request, Response } from "express-serve-static-core";
import {
  CreateUser,
  ExtendedUser,
  PaymentMethod,
  UserFinal,
  UserResult,
} from "../models/typesOrInterfaces/user";
import helper from "../helper";
import User from "../models/user.model";
import * as argon from "argon2";
import { IProduct } from "../models/typesOrInterfaces/product";

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

const addFavorites = async (
  req: Request<{}, {}, IProduct>,
  res: Response<{ favorites: IProduct[] | undefined }>
) => {
  const { _id } = (req as unknown as ExtendedUser).user;
  const { goodId } = req.params as { goodId: string };

  const user = await User.findById(_id).select("-password");

  if (!user) return helper.errorHandler(400, "User not found!");

  const checkIfGoodInFavorites = () => {
    return user.favorites?.some((fav) => fav.id === goodId) ?? false;
  };

  if (checkIfGoodInFavorites())
    return helper.errorHandler(400, "Good already in favorites!");

  const newFav = req.body;

  const userWithNewFavorite = await User.findByIdAndUpdate(
    _id,
    { $push: { favorites: newFav } },
    { new: true }
  ).select("-password");

  if (!userWithNewFavorite) return helper.errorHandler(500);

  const safeUser: UserFinal = {
    ...userWithNewFavorite.toObject(),
    favorites: userWithNewFavorite.favorites ?? [],
  };

  return res.status(200).json({ favorites: safeUser.favorites });
};

const removeFavorites = async (
  req: Request,
  res: Response<{ favorites: IProduct[] | undefined }>
) => {
  const { _id } = (req as unknown as ExtendedUser).user;
  const { goodId } = req.params;

  const user = await User.findById(_id).select("-password");

  if (!user) return helper.errorHandler(400, "User not found!");

  const checkIfGoodInFavorites = () => {
    return user.favorites?.some((fav) => fav.id === goodId);
  };

  if (!checkIfGoodInFavorites())
    return helper.errorHandler(400, "Good already not in favorites!");

  const userWithNewFavorite = await User.findByIdAndUpdate(
    _id,
    { $pull: { favorites: { id: goodId } } },
    { new: true }
  ).select("-password");

  if (!userWithNewFavorite) return helper.errorHandler(500);

  const safeUser: UserFinal = {
    ...userWithNewFavorite.toObject(),
    favorites: userWithNewFavorite.favorites ?? [],
  };

  return res.status(200).json({ favorites: safeUser.favorites });
};

const addPaymentSystem = async (
  req: Request<{}, {}, PaymentMethod>,
  res: Response<{ newPayment: PaymentMethod[] | undefined }>
  // res: Response<{ userWithNewPayment: UserFinal; newPayment: PaymentMethod }>
) => {
  const { type } = req.body;
  const { _id } = (req as unknown as ExtendedUser).user;

  let newPayment = {} as PaymentMethod;

  if (type === "card") {
    const { cardHolderName, cardNumber, cvc, brand, expiryMonth, expiryYear } =
      req.body;

    if (
      !cardHolderName ||
      !cardNumber ||
      !cvc ||
      !brand ||
      !expiryMonth ||
      !expiryYear
    )
      return helper.errorHandler(400, "Full all fields!");

    newPayment = req.body;
  } else {
    const { email } = req.body;

    if (!email) return helper.errorHandler(400, "Full all fields!");

    newPayment = req.body;
  }

  const userWithNewPayment = await User.findByIdAndUpdate(
    _id,
    {
      $push: { paymentMethods: newPayment },
    },
    { new: true }
  );

  if (!userWithNewPayment)
    return helper.errorHandler(500, "Something went wrong");

  return res
    .status(200)
    .json({ newPayment: userWithNewPayment.paymentMethods });
};

const removePayment = async (
  req: Request,
  res: Response<{ paymentId: string }>
) => {
  const { paymentId } = req.params;
  const { _id } = (req as unknown as ExtendedUser).user;

  const user = await User.findById(_id);

  if (!user) return helper.errorHandler(400, "User not found!");

  if (
    user.paymentMethods?.some((method) => method._id?.toString() === paymentId)
  ) {
    const removedPayment = await User.findByIdAndUpdate(
      _id,
      {
        $pull: {
          paymentMethods: { _id: paymentId },
        },
      },
      { new: true }
    );

    if (!removedPayment)
      return helper.errorHandler(500, "Something went wrong!");

    return res.status(200).json({ paymentId });
  } else {
    return helper.errorHandler(400, "Payment system is not found");
  }
};

export default {
  getUser: helper.ctrlWrapper(getUser),
  updateUser: helper.ctrlWrapper(updateUser),
  deleteAccount: helper.ctrlWrapper(deleteAccount),
  addFavorites: helper.ctrlWrapper(addFavorites),
  removeFavorites: helper.ctrlWrapper(removeFavorites),
  addPaymentSystem: helper.ctrlWrapper(addPaymentSystem),
  removePayment: helper.ctrlWrapper(removePayment),
};
