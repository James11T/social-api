import speakeasy from "speakeasy";
import qr from "qrcode";
import jwt from "jsonwebtoken";
import { userModel, isUserIDTaken, UserType } from "../schemas/user.schema";
import {
  APIBadRequestError,
  APIConflictError,
  APINotFoundError,
  APIServerError,
  APIUnauthorizedError
} from "../errors/api";
import { hashPassword, invokePasswordReset } from "../auth/password";
import type { ChangePasswordToken } from "../auth/password";
import { getVerificationToken } from "../email/verification";
import { sendTemplate } from "../email/transporter";
import { WEB_CONSTANTS, RUNTIME_CONSTANTS } from "../constants";
import { verifyOTP } from "../auth/otp";
import type { NextFunction, Request, Response } from "express";

const { JWT_SECRET } = process.env;

/**
 * Authenticate a user with their email and password
 *
 * @param req Express request object
 * @param res Express response object
 */
const signInController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.json({ success: true, user: { userId: req.user.userId } });

  // TODO: Test
}; // POST

interface SignUpBody {
  userId: string;
  email: string;
  password: string;
}

/**
 * Create a new user from the request body
 *
 * @param req Express request object
 * @param res Express response object
 */
const signUpController = async (
  req: Request<unknown, unknown, SignUpBody>,
  res: Response,
  next: NextFunction
) => {
  if (req.user) return next(new APIBadRequestError("Already signed in"));

  const { userId, email, password } = req.body;

  let isTaken: boolean;
  try {
    isTaken = await isUserIDTaken(userId);
  } catch {
    return next(new APIServerError("Failed to check user ID"));
  }

  if (isTaken)
    return next(new APIConflictError("User ID is taken or reserved."));

  let passwordHash;
  try {
    passwordHash = await hashPassword(password);
  } catch {
    return next(new APIServerError("Failed to hash password"));
  }

  const verificationToken = getVerificationToken();

  const user: UserType = {
    userId,
    passwordHash,
    email: {
      value: email,
      token: verificationToken
    }
  };

  const newUser = new userModel(user);

  try {
    await newUser.save();
  } catch {
    return next(new APIServerError("Failed to create user"));
  }

  try {
    await sendTemplate(
      email,
      "confirmEmail",
      {
        name: userId,
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
 * Clear the authentication cookie
 *
 * @param req Express request object
 * @param res Express response object
 */
const deauthController = async (req: Request, res: Response) => {
  req.logout();
  res.send({ success: true });

  // TODO: Test
}; // GET

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
  const { userId } = req.params;

  let user;
  try {
    user = await userModel.findOne({ userId });
  } catch (err) {
    return next(new APIServerError("Failed to check user"));
  }

  if (!user) return next(new APINotFoundError("User does not exist"));

  let token;
  try {
    token = await invokePasswordReset(user);
  } catch (err) {
    return next(new APIServerError("Failed to send password reset email"));
  }

  res.json({
    success: true,
    token: RUNTIME_CONSTANTS.IS_DEV ? token : undefined
  });

  // TODO: Test
}; // GET

interface OTPBody {
  otp: string;
}

/**
 * Used to generate a 2FA secret and set the OTP status to pending
 *
 * @param req Express request object
 * @param res Express response object
 */
const enable2FA = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.otp.status === "enabled")
    return next(new APIBadRequestError("2FA is already enabled"));

  const secret = speakeasy.generateSecret({
    name: `Kakapo (${req.user.userId})`
  });

  try {
    await req.user.updateOne({
      otp: { status: "pending", secret: secret.base32, enabledAt: new Date() }
    });
  } catch (err) {
    return next(new APIServerError("Failed to enable 2FA"));
  }

  let userQR: string;
  try {
    userQR = await qr.toDataURL(secret.otpauth_url, { margin: 2 });
  } catch (err) {
    return next(new APIServerError("Failed to generate 2FA QR code"));
  }

  return res.json({ qr: userQR });
  // TODO: Test
}; // GET

/**
 * Used to verify 2FA secret and set the OTP status to enabled
 *
 * @param req Express request object
 * @param res Express response object
 */
const activate2FA = async (
  req: Request<unknown, unknown, OTPBody>,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return next(new APIUnauthorizedError("Not signed in"));

  if (req.user.otp.status === "disabled") {
    return next(new APIBadRequestError("2FA is not pending"));
  } else if (req.user.otp.status === "enabled") {
    return next(new APIBadRequestError("2FA is already enabled"));
  }

  const { otp } = req.body;

  let isOTPValid: boolean;
  try {
    isOTPValid = verifyOTP(req.user, otp);
  } catch (err) {
    return next(new APIServerError("Failed to verify OTP"));
  }

  if (!isOTPValid) return next(new APIUnauthorizedError("Invalid OTP"));

  try {
    await req.user.updateOne({
      otp: {
        status: "enabled",
        enabledAt: new Date(),
        secret: req.user.otp.secret
      }
    });
  } catch {
    return next(new APIServerError("Failed to activate 2FA"));
  }

  return res.json({ success: true });

  // TODO: Test
}; // POST

/**
 * Used to verify 2FA secret and set the OTP status to enabled
 *
 * @param req Express request object
 * @param res Express response object
 */
const disable2FA = async (
  req: Request<unknown, unknown, OTPBody>,
  res: Response,
  next: NextFunction
) => {
  if (req.user.otp.status === "disabled") {
    return next(new APIBadRequestError("2FA is not enabled"));
  }

  const { otp } = req.body;

  let isOTPValid: boolean;
  try {
    isOTPValid = verifyOTP(req.user, otp);
  } catch (err) {
    return next(new APIServerError("Failed to verify OTP"));
  }

  if (!isOTPValid) return next(new APIUnauthorizedError("Invalid OTP"));

  try {
    await req.user.updateOne({
      otp: { status: "disabled", enabledAt: null, secret: "" }
    });
  } catch {
    return next(new APIServerError("Failed to disable 2FA"));
  }

  return res.json({ success: true });

  // TODO: Test
}; // POST

/**
 * Return the current user
 *
 * @param req Express request object
 * @param res Express response object
 */
const whoAmIController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return next(new APIUnauthorizedError("Not signed in"));

  return res.json(req.user);

  // TODO: Test
};

const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { resetToken, userId, password } = req.body;

  let user;
  try {
    user = await userModel.findOne({ userId });
  } catch (err) {
    return next(new APIServerError("Failed to check authorisation"));
  }

  let tokenData: ChangePasswordToken;
  try {
    tokenData = jwt.verify(resetToken, JWT_SECRET) as ChangePasswordToken;
  } catch (err) {
    return next(new APIBadRequestError("Invalid JWT"));
  }

  const dbToken = user.resetTokens.find((t) => t.token === tokenData.token);

  if (!dbToken) {
    return next(new APIBadRequestError("Invalid token"));
  }

  if (dbToken.expires < new Date()) {
    return next(new APIBadRequestError("Token has expired"));
  }

  let passwordHash;
  try {
    passwordHash = await hashPassword(password);
  } catch {
    return next(new APIServerError("Failed to hash password"));
  }

  try {
    await user.updateOne({
      passwordHash,
      $pull: {
        resetTokens: { token: tokenData.token }
      }
    });
  } catch (err) {
    console.error(err);
    return next(new APIServerError("Failed to update password"));
  }

  return res.json({ success: true });
}; // POST

const get2FAStatus = (req: Request, res: Response, next: NextFunction) => {
  return res.json({ status: req.user.otp.status });
};

export {
  signInController,
  signUpController,
  deauthController,
  forgotPasswordController,
  whoAmIController,
  enable2FA,
  activate2FA,
  disable2FA,
  get2FAStatus,
  changePasswordController
};
