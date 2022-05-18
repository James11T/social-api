import { APIUnauthorizedError, APIServerError } from "../errors/api";
import passport from "passport";
import type { Request, Response, NextFunction } from "express";

const authenticate =
  (strategy: string = "local") =>
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user) return next(new APIUnauthorizedError(info.message));

      req.login(user, (loginError) => {
        if (loginError)
          return next(new APIServerError("Failed to authenticate"));
      });

      req.user = user;
      next();
    })(req, res, next);
  }; // TODO: Test

const protect = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user)
    return next(
      new APIUnauthorizedError(
        "You must be authenticated to access this resource."
      )
    );

  next();
  // TODO: Test
};

export { authenticate, protect };
