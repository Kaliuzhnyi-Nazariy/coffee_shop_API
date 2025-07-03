import mongoose, { Types } from "mongoose";
import { IProduct } from "./product";

export interface IUser {
  name: string;
  phoneNumber: string;
  password: string;
  favorites?: IProduct[];
  location?: string;
  paymentMethods?: PaymentMethod[];
  cart?: CartItem[];
}

export type PaymentMethod = {
  type: "card" | "paypal";
  cardHolderName?: string;
  brand?: string;
  // last4?: string;
  expiryMonth?: string;
  expiryYear?: string;
  email?: string;
  cardNumber?: string;
  cvc?: string;
  token?: string;
  _id?: string | Types.ObjectId;
};

export type PayPalPayment = {
  type: "paypal";
  email: string;
  payerId?: string;
  transactionId?: string;
};

export type PaymentArrays = PaymentMethod[];

export interface UserResult {
  _id: mongoose.Types.ObjectId;
  name: string;
  phoneNumber: string;
  favorites: IProduct[];
  location: string | undefined;
  paymentMethods: PaymentMethod[] | undefined;
  [key: string]: any;
}

export interface UserFinal {
  _id: mongoose.Types.ObjectId;
  name: string;
  phoneNumber: string;
  favorites?: IProduct[];
  location?: string;
  paymentMethods?: PaymentMethod[] | undefined;
  [key: string]: any;
}

export interface ExtendedUser extends UserResult {
  _id: mongoose.Types.ObjectId;
}

export interface CreateUser {
  name: string;
  phoneNumber: string;
  password: string;
  location: string;
}

export type LogUser = Omit<CreateUser, "location" | "name">;

export interface CartItem {
  id: string;
  amount: number;
}
