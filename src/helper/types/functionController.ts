import { NextFunction, Request, Response } from "express-serve-static-core";

export type FunctionalController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;
