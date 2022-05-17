import type { Request, Response, NextFunction } from "express";
import { APIBaseError } from "../errors/api";

const errorHandler = (
  err: APIBaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status).json(err.toJSON());
};

export default errorHandler;
