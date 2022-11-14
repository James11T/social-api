import { APIParameterError } from "../errors/api";
import { validationResult } from "express-validator";
import type { BadParams } from "../errors/api";
import type { Request, Response, NextFunction } from "express";

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const badParams: BadParams = {};

    errors.array().forEach((error) => {
      badParams[error.param] = {
        location: error.location ?? "unknown",
        message: error.msg
      };
    });

    return next(new APIParameterError("One or more supplied parameters are invalid", badParams));
  }

  next();
};

export default validateRequest;
