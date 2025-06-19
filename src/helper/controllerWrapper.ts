import { NextFunction, Request, Response } from "express-serve-static-core";
import { FunctionalController } from "./types";

const ctrlWrapper = (ctrl: FunctionalController) => {
  const fn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return fn;
};

export default ctrlWrapper;
