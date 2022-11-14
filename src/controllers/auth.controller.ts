import qr from "qrcode";
import jwt from "jsonwebtoken";
import { User, UserTOTP } from "../models";
import { signToken } from "../utils/jwt";
import { sendTemplate } from "../services/ses";
import { generateRefreshToken } from "../auth/tokens";
import { countryCodeEmoji } from "country-code-emoji";
import {
  APIBadRequestError,
  APIConflictError,
  APINotFoundError,
  APIServerError,
  APIUnauthorizedError
} from "../errors/api";
import { getVerificationToken } from "../email/verification";
import { WEB_CONSTANTS, RUNTIME_CONSTANTS, TOTP_CONSTANTS } from "../config";
import { hashPassword, invokePasswordReset, verifyPassword } from "../auth/password";
import type { NextFunction, Request, Response } from "express";
import { authenticator } from "otplib";

const { JWT_SECRET } = process.env;

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
const signInController = async (req: Request<unknown, unknown, SignInBody>, res: Response, next: NextFunction) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  const failError = new APINotFoundError("No user with the given email exists.");

  if (!user) return next(failError);

  const passwordsMatch = await verifyPassword(req.body.password, user.passwordHash);
  if (!passwordsMatch) return next(failError);

  const [refreshToken] = await generateRefreshToken(user, "auth");
  const signedToken = await signToken(refreshToken);

  if (signedToken.err) {
    if (signedToken.val === "SIGN_TOKEN_ERROR") {
      return next(new APIServerError("Failed to start new user session"));
    }
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

  let isTaken: boolean;
  try {
    const getUsername = await User.fromUsername(username);
    if (getUsername.err) {
      if (getUsername.val === "FAILED_TO_FETCH_USER") {
        return next(new APIServerError("Failed to check username availability"));
      }
    }
    isTaken = getUsername !== null;
  } catch {
    return next(new APIServerError("Failed to check user ID"));
  }

  if (isTaken) return next(new APIConflictError("User ID is taken or reserved"));

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

  const saveResult = await newUser.saveProxy();

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
  } catch {
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

export { signInController, signUpController, forgotPasswordController, whoAmIController };
