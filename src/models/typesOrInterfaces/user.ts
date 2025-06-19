import mongoose from "mongoose";

export interface IUser {
  name: string;
  phoneNumber: string;
  password: string;
  favorites?: string[];
  location?: string;
  paymentMethods?: PaymentMethod[];
}

export interface PaymentMethod {
  name: string;
  number: string;
}

export type PaymentArrays = PaymentMethod[];

export interface UserResult {
  _id: mongoose.Types.ObjectId;
  name: string;
  phoneNumber: string;
  favorites: string[] | undefined;
  location: string | undefined;
  paymentMethods: PaymentMethod[] | undefined;
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
