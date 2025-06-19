import { NextFunction, Request, Response } from "express-serve-static-core";
import helper from "../helper";
import * as jwt from "jsonwebtoken";
import User from "../models/user.model";
import mongoose from "mongoose";
import { ExtendedUser, UserResult } from "../models/typesOrInterfaces/user";

const { SECRET_JWT } = process.env;

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) return helper.errorHandler(401);

  try {
    const decodedToken = jwt.verify(token, SECRET_JWT as string) as {
      id: mongoose.Types.ObjectId;
    };

    const isUser = await User.findById(decodedToken.id).select("-password");

    if (!isUser) return helper.errorHandler(401, "Invalid token");

    (req as unknown as ExtendedUser).user = isUser;
    next();
  } catch (error) {
    return helper.errorHandler(401, "Invalid token");
  }
};

export default isAuth;
