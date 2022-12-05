import { APIBaseError } from "../errors/api";
import type { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error | string,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (typeof err === "string") {
    const errorCodes = err.match(/^([45]\d\d)_(.+)$/); // Split 404_ERROR into 404_ERROR, 404, and ERROR
    if (!errorCodes || errorCodes.length < 3)
      return res.status(500).json({ error: "Unexpected error" });
    const [_, code, error] = errorCodes;
    return res.status(Number(code)).json({ error });
  } else if (err instanceof APIBaseError) {
    return res.status(err.status).json(err.toJSON());
  } else if (err instanceof SyntaxError) {
    // Usually when express.json fails
    return res.status(400).json({
      error: "The supplied data was malformed"
    });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
