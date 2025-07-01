import { NextFunction, Request, Response } from "express-serve-static-core";
import { ZodTypeAny } from "zod";
import helper from "../helper";

const validator = (validatorSchema: ZodTypeAny) => {
  const fn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validatorSchema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error) {
        throw helper.errorHandler(
          400,
          error.errors.map((err: { message: string }) => err.message)
        );
      } else {
        next(error);
      }
    }
  };

  return fn;
};

export default validator;
