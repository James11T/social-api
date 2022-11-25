import {
  APIServerError,
  APIConflictError,
  APINotFoundError,
  APIBadRequestError,
  APIUnauthorizedError
} from "../errors/api";
import { User } from "../models";
import { sendTemplate } from "../email/templates";
import { generateAccessToken, generateRefreshToken } from "../auth/tokens";
import { decodeSignedToken, signToken } from "../utils/jwt";
import { getVerificationToken } from "../email/verification";
import { WEB_CONSTANTS, RUNTIME_CONSTANTS } from "../config";
import { hashPassword, invokePasswordReset, verifyPassword } from "../auth/password";
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

  const failError = new APINotFoundError("No user with the given email exists.");

  if (!user) return next(failError);

  const passwordsMatch = await verifyPassword(req.body.password, user.passwordHash);
  if (!passwordsMatch) return next(failError);

  const [refreshToken] = await generateRefreshToken(user, "auth");
  const signedToken = signToken(refreshToken);

  if (signedToken.err) {
    return next(new APIServerError("Failed to start new user session"));
  }

  return res.json({
    success: true,
    refreshToken: signedToken.val,
    user: {
      email: user.email,
      username: user.username
    }
  });

  // TODO: Test
}; // POST

const refreshAccessController = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken, userId } = req.body;

  const user = await User.fromId(userId);

  if (user.err) return next(new APIServerError("Failed to fetch user"));
  if (!user.val) return next(new APINotFoundError("User not found"));

  const tokenResult = decodeSignedToken<JWTRefreshToken>(refreshToken);

  if (tokenResult.err) return next(new APIUnauthorizedError(tokenResult.val));

  if (tokenResult.val.sub !== user.val.id) return next(new APIUnauthorizedError("Invalid refresh token"));

  const accessToken = await generateAccessToken(user.val, tokenResult.val);

  if (accessToken.err) {
    if (accessToken.val === "FAILED_TO_GET_REFRESH_TOKEN") return next(new APIServerError(accessToken.val));

    return next(new APIBadRequestError(accessToken.val));
  }

  const accessJWT = signToken(accessToken);

  if (accessJWT.err) return 

  return res.json({});

  /**
   * 1. Get refresh token ✓
   * 2. Decode token ✓
   * 3. Check expiry ✓
   * 4. Generate access token
   * 5. Return to user
   */
}; // POST

interface SignUpBody {
  username: string;
  email: string;
  password: string;
}

/**
 * Create a new user from the request body
 *
 * Methods: POST
 */
const signUpController = async (req: Request<unknown, unknown, SignUpBody>, res: Response, next: NextFunction) => {
  if (req.user) return next(new APIBadRequestError("Cannot sign up while authenticated"));

  const { username, email, password } = req.body;

  const getUsername = await User.fromUsername(username);
  if (getUsername.err) return next(new APIServerError("Failed to check username availability"));

  if (getUsername.val) return next(new APIConflictError("User ID is taken or reserved"));

  const passwordHash = await hashPassword(password);
  if (passwordHash.err) {
    return next(new APIServerError("Failed to hash password"));
  }

  const verificationToken = getVerificationToken();

  const newUser = new User();
  newUser.username = username;
  newUser.email = email;
  newUser.registeredAt = new Date();
  newUser.passwordHash = passwordHash.val;

  const saveResult = await newUser.pcallSave();

  if (saveResult.err) {
    return next(new APIServerError("Failed to create user"));
  }

  try {
    await sendTemplate(
      email,
      "confirmEmail",
      {
        name: username,
        link: `${WEB_CONSTANTS.URL}email/verify?c=${verificationToken}`
      },
      { subject: "Confirm your email" }
    );
  } catch (err) {
    console.error(err);

    return next(new APIServerError("Failed to send confirmation email"));
  }

  return res.json({ success: true });

  // TODO: Test
}; // POST

/**
 * Trigger a password reset
 *
 * @param req Express request object
 * @param res Express response object
 */
const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
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
    token: RUNTIME_CONSTANTS.IS_DEV ? token : undefined
  });

  // TODO: Test
}; // GET

/**
 * Return the current user
 */
const whoAmIController = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.json({ user: null });
  }

  return res.json({ user: req.user });

  // TODO: Test
};

export { authenticateController, signUpController, forgotPasswordController, whoAmIController };
