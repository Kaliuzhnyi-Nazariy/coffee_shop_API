import { Schema, model, Types } from "mongoose";
import { IUser, PaymentArrays, PaymentMethod } from "./typesOrInterfaces/user";
import helper from "../helper";

const PaymentSchema = new Schema<PaymentMethod>({
  name: { type: String, required: true },
  number: { type: String, required: true },
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
      },
      message: "Invalid email format",
    },
    unique: true,
  },
  password: { type: String, required: true },
  favorites: [],
  location: String,
  paymentMethods: { type: [PaymentSchema] },
});

(userSchema as any).post("save", helper.MongooseErrorHandler);

const User = model<IUser>("user", userSchema);

export default User;
