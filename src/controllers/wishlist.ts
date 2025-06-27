import { Request, Response } from "express-serve-static-core";
import { ExtendedUser, IUser } from "../models/typesOrInterfaces/user";
import User from "../models/user.model";
import helper from "../helper";
import { IProduct } from "../models/typesOrInterfaces/product";

const addToWishlist = async (
  req: Request<{}, {}, IProduct>,
  res: Response<{ user?: IUser; newWishlistItem?: IProduct; message?: string }>
) => {
  const { id, title, price, description, category, image, rating } = req.body;
  const { id: userId } = (req as unknown as ExtendedUser).user;

  const isUser = await User.findById(userId);

  if (!isUser) return helper.errorHandler(400, "User not found");

  const isGoodInWishlist = isUser?.wishlist?.find((item) => item.id == id);

  let user;

  if (isGoodInWishlist) {
    return res.status(400).json({ message: "Good is already in wishlist!" });
  } else {
    user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { wishlist: req.body },
      },
      { new: true }
    );
  }

  if (!user) return helper.errorHandler(400);

  const newWishlistItem = {
    id,
    title,
    price,
    description,
    category,
    image,
    rating,
  } as IProduct;

  return res.status(200).json({ user, newWishlistItem });
};

const removeFromWishlist = async (req: Request, res: Response<IUser>) => {
  const { goodId } = req.params;
  const { id } = (req as unknown as ExtendedUser).user;

  const user = await User.findById(id);
  if (!user) return helper.errorHandler(400);

  const updatedUser = await User.findOneAndUpdate(
    { _id: id, "wishlist.id": goodId },
    {
      $pull: { wishlist: { id: goodId } },
    },
    {
      new: true,
    }
  );

  if (!updatedUser) return helper.errorHandler(400, "Something went wrong!");

  return res.status(200).json(updatedUser);
};

export default {
  addToWishlist: helper.ctrlWrapper(addToWishlist),
  removeFromWishlist: helper.ctrlWrapper(removeFromWishlist),
};
