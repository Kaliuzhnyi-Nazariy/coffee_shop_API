import { NextFunction } from "express";

const MongooseErrorHandler = (
  err: {
    name: string;
    status: number;
    code: number;
  },
  data: unknown,
  next: NextFunction
) => {
  const { name, code } = err;
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  err.status = status;
  next();
};

export default MongooseErrorHandler;
