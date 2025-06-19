import { Schema, model, Types } from "mongoose";
import { IUser, PaymentArrays, PaymentMethod } from "./typesOrInterfaces/user";
import helper from "../helper";

export const PaymentSchema = new Schema<PaymentMethod>({
  name: { type: String, required: true },
  number: { type: String, required: true },
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phoneNumber: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  favorites: { type: [String], default: [] },
  location: String,
  paymentMethods: { type: [PaymentSchema] },
});

(userSchema as any).post("save", helper.MongooseErrorHandler);

const User = model<IUser>("user", userSchema);

export default User;
