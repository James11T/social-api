import { APIBaseError } from "../errors/api";
import type { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof APIBaseError) {
    return res.status(err.status).json(err.toJSON());
  } else if (err instanceof SyntaxError) {
    return res.status(400).json({
      error: "The supplied data was malformed"
    });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
