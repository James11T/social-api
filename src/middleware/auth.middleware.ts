import { userModel, UserType } from "../schemas/user.schema";
import type { Request, Response, NextFunction } from "express";

// Assume production for safety
const { NODE_ENV = "production" } = process.env;

/**
 * Authenticates as a development user.
 * Takes either x-user-id header or debugUserId query parameter.
 *
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 */
const developmentAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers["x-user-id"] || req.query["debugUserId"];

  if (!userId) return next();

  let user: UserType;
  try {
    user = await userModel.findOne({ userId });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }

  if (!user) return res.status(400).json({ error: "User not found" });

  req.user = user;
  return next();
  // #TODO: Test
};

/**
 * Athenticates a user in a development environment.
 *
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 */
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (NODE_ENV === "development")
    return await developmentAuthentication(req, res, next);

  next();
  // #TODO: Test
};

const protect = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  next();

  // #TODO: Test
};

export { authenticate, protect };
