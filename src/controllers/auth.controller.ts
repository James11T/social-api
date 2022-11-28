import {
  APIServerError,
  APINotFoundError,
  APIBadRequestError,
  APIUnauthorizedError,
} from "../errors/api";
import { getEpoch } from "../utils/time";
import { RefreshToken, User } from "../models";
import { decodeSignedToken, signToken } from "../utils/jwt";
import { invokePasswordReset, verifyPassword } from "../auth/password";
import { RUNTIME_CONSTANTS, REFRESH_TOKEN_CONSTANTS } from "../config";
import { generateAccessToken, generateRefreshToken } from "../auth/tokens";
import type { JWTRefreshToken } from "../types";
import type { NextFunction, Request, Response } from "express";

interface SignInBody {
  email: string;
  password: string;
}

/**
 * Authenticate a user with their email and password and return a refresh token
 *
 * Methods: POST
 *
 */
const authenticateController = async (
  req: Request<unknown, unknown, SignInBody>,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  const failError = new APINotFoundError(
    "No user with the given email exists."
  );

  if (!user) return next(failError);

  const passwordsMatch = await verifyPassword(
    req.body.password,
    user.passwordHash
  );
  if (!passwordsMatch) return next(failError);

  const [refreshJWT, tokenId] = await generateRefreshToken(user, "auth");

  const newRefreshToken = new RefreshToken();
  newRefreshToken.id = tokenId;
  newRefreshToken.subjectId = user.id;
  newRefreshToken.expiresAt = new Date(
    getEpoch() + REFRESH_TOKEN_CONSTANTS.TOKEN_TTL
  );
  newRefreshToken.issuedAt = new Date();
  newRefreshToken.sourceIp = req.realIp;

  try {
    await newRefreshToken.save();
  } catch (err) {
    console.error(err);

    return next(new APIServerError("Failed to save refresh token"));
  }

  const signedToken = signToken(refreshJWT);

  if (signedToken.err) {
    return next(new APIServerError("Failed to start new user session"));
  }

  return res.json({
    success: true,
    refreshToken: signedToken.val,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });

  // TODO: Test
}; // POST

const refreshAccessController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, userId } = req.body;

  const user = await User.fromId(userId);

  if (user.err) return next(new APIServerError("Failed to fetch user"));
  if (!user.val) return next(new APINotFoundError("User not found"));

  const tokenResult = decodeSignedToken<JWTRefreshToken>(refreshToken);

  if (tokenResult.err) return next(new APIUnauthorizedError(tokenResult.val));

  if (tokenResult.val.sub !== user.val.id)
    return next(new APIUnauthorizedError("Invalid refresh token"));

  const accessToken = await generateAccessToken(user.val, tokenResult.val);

  if (accessToken.err) {
    if (accessToken.val === "FAILED_TO_GET_REFRESH_TOKEN")
      return next(new APIServerError(accessToken.val));

    return next(new APIBadRequestError(accessToken.val));
  }

  const accessJWT = signToken(accessToken.val);

  if (accessJWT.err)
    return next(new APIServerError("Failed to generate access token"));

  return res.json({
    accessToken: accessJWT.val,
  });
}; // POST

/**
 * Trigger a password reset
 *
 * @param req Express request object
 * @param res Express response object
 */
const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const user = await User.fromId(id);

  if (user.err) return next(new APIServerError("Failed to fetch user"));
  if (!user.val) return next(new APINotFoundError("User does not exist"));

  let token: string;
  try {
    token = await invokePasswordReset(user.val); // TODO: Update
  } catch (err) {
    return next(new APIServerError("Failed to send password reset email"));
  }

  res.json({
    success: true,
    token: RUNTIME_CONSTANTS.IS_DEV ? token : undefined,
  });

  // TODO: Test
}; // GET

/**
 * Return the current user
 */
const whoAmIController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.json({ user: null });
  }

  return res.json({ user: req.user });

  // TODO: Test
};

export {
  authenticateController,
  forgotPasswordController,
  whoAmIController,
  refreshAccessController,
};
