import { Schema, model, Types } from "mongoose";
import {
  CartItem,
  IUser,
  PaymentArrays,
  PaymentMethod,
} from "./typesOrInterfaces/user";
import helper from "../helper";
import { IProduct, IProductCart } from "./typesOrInterfaces/product";

export const PaymentSchema = new Schema<PaymentMethod>({
  type: { type: String, enum: ["card", "paypal"], required: true },
  cardHolderName: { type: String },
  brand: { type: String },
  // last4: { type: String },
  expiryMonth: { type: String },
  expiryYear: { type: String },
  email: { type: String },
  token: { type: String },
});

const CartItemSchema = new Schema<IProductCart>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { hot: Boolean, cold: Boolean },
  image: { type: String, required: true },
  rating: { rate: Number },
  amount: { type: Number, required: true },
});

const FavoriteSchema = new Schema<IProduct>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { hot: Boolean, cold: Boolean },
  image: { type: String, required: true },
  rating: { rate: Number },
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phoneNumber: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  favorites: { type: [FavoriteSchema], default: [] },
  location: { type: String, default: "" },
  paymentMethods: { type: [PaymentSchema], default: [] },
  cart: { type: [CartItemSchema], default: [] },
});

(userSchema as any).post("save", helper.MongooseErrorHandler);

const User = model<IUser>("user", userSchema);

export default User;
