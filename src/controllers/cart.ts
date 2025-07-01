import { Request, Response } from "express-serve-static-core";
import {
  CartItem,
  ExtendedUser,
  IUser,
} from "../models/typesOrInterfaces/user";
import User from "../models/user.model";
import helper from "../helper";
import { IProduct, IProductCart } from "../models/typesOrInterfaces/product";

const addToCart = async (
  req: Request<{}, {}, IProductCart>,
  res: Response<{ user: IUser; newCartItem: IProduct }>
) => {
  const { id, amount, title, price, description, category, image, rating } =
    req.body;
  const { id: userId } = (req as unknown as ExtendedUser).user;

  const isUser = await User.findById(userId);

  if (!isUser) return helper.errorHandler(400, "User not found");

  const isGoodInCart = isUser?.cart?.find((item) => item.id == id);

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
        $push: { cart: req.body },
      },
      { new: true }
    );
  }

  if (!user) return helper.errorHandler(400);

  const newCartItem = {
    id,
    amount,
    title,
    price,
    description,
    category,
    image,
    rating,
  } as IProduct;

  return res.status(200).json({ user, newCartItem });
};

const removeFromCart = async (
  req: Request,
  res: Response<{ user: IUser; goodId: string }>
) => {
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

  return res.status(200).json({ user: updatedUser, goodId });
};

export default {
  addToCart: helper.ctrlWrapper(addToCart),
  removeFromCart: helper.ctrlWrapper(removeFromCart),
};
