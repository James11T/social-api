import { User } from "../models";
import { decodeSignedToken } from "../utils/jwt";
import { APIUnauthorizedError } from "../errors/api";
import type { JWTAccessToken } from "../types";
import type { Request, Response, NextFunction } from "express";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let accessToken = req.headers.authorization;
  if (!accessToken) return next();

  if (accessToken.startsWith("Bearer ")) accessToken = accessToken.slice(7); // If the auth starts with Bearer, remove it

  const decoded = decodeSignedToken<JWTAccessToken>(accessToken);
  if (decoded.err) return next(new APIUnauthorizedError("Bad access token"));

  const user = await User.findOne({ where: { id: decoded.val.sub } });
  if (!user)
    return next(
      new APIUnauthorizedError("Failed to access token subject user")
    );

  req.user = user;
  next();
};

const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  next();
  // TODO: DO
  // TODO: Test
};

export { authenticate, protect };
