import { NextFunction, Request, Response } from "express-serve-static-core";
import { Schema } from "zod/v4";
import helper from "../helper";

const validator = (validatorSchema: Schema) => {
  const fn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validatorSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof Error) {
        throw helper.errorHandler(400, error?.message);
      } else {
        next(error);
      }
    }
  };

  return fn;
};

export default validator;
