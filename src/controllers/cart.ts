import { Request, Response } from "express-serve-static-core";
import {
  CartItem,
  ExtendedUser,
  IUser,
} from "../models/typesOrInterfaces/user";
import User from "../models/user.model";
import helper from "../helper";

const addToCart = async (
  req: Request<{}, {}, CartItem>,
  res: Response<{ user: IUser; newCartItem: CartItem }>
) => {
  const { id, amount } = req.body;
  const { id: userId } = (req as unknown as ExtendedUser).user;

  const isUser = await User.findById(userId);

  if (!isUser) return helper.errorHandler(400, "User not found");

  const newCartItem: CartItem = {
    id,
    amount,
  };

  const isGoodInCart = isUser?.cart?.some((item) => item.id === id);

  let user;

  if (isGoodInCart) {
    user = await User.findOneAndUpdate(
      { _id: userId, "cart.id": id },
      {
        $inc: { "cart.$.amount": amount },
      },
      { new: true }
    );
  } else {
    user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { cart: newCartItem },
      },
      { new: true }
    );
  }

  if (!user) return helper.errorHandler(400);

  return res.status(200).json({ user, newCartItem });
};

const removeFromCart = async (req: Request, res: Response<IUser>) => {
  const { goodId } = req.params;
  const { id } = (req as unknown as ExtendedUser).user;

  const user = await User.findById(id);
  if (!user) return helper.errorHandler(400);

  const updatedUser = await User.findOneAndUpdate(
    { _id: id, "cart.id": goodId },
    {
      $pull: { cart: { id: goodId } },
    },
    {
      new: true,
    }
  );

  if (!updatedUser) return helper.errorHandler(400, "Something went wrong!");

  return res.status(200).json(updatedUser);
};

export default {
  addToCart: helper.ctrlWrapper(addToCart),
  removeFromCart: helper.ctrlWrapper(removeFromCart),
};
