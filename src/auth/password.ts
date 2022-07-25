import argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  HASHING_CONSTANTS,
  PASSWORD_RESET_CONSTANTS,
  WEB_CONSTANTS
} from "../config";
import { validateEmail } from "../validation/data";
import { userModel } from "../schemas/user.schema";
import { HydratedDocument } from "mongoose";
import { sendTemplate } from "../email/transporter";
import { verifyOTP } from "./otp";
import type { UserType } from "../schemas/user.schema";
import type { Request } from "express";

const { JWT_SECRET } = process.env;

const hashingOptions = {
  type: HASHING_CONSTANTS.HASHING_FUNCTION,
  hashLength: HASHING_CONSTANTS.HASH_LENGTH_BYTES,
  saltLength: HASHING_CONSTANTS.SALT_SIZE_BYTES
};

/**
 * Check that a password matches a given salt and hash.
 *
 * @param password A password to validate
 * @param hash A password hash to validate against
 * @returns True if the password is valid
 */
const verifyPassword = async (password: string, hash: string) => {
  const isValid = await argon2.verify(hash, password, hashingOptions);

  return isValid;
};

/**
 * Hash a password either with a generated salt.
 *
 * @param password A password to hash
 * @returns A password hash and salt
 */
const hashPassword = async (password: string) => {
  const hash = await argon2.hash(password, hashingOptions);

  return hash;
};

/**
 * Passport local strategy verify function.
 *
 * @param req Express request object
 * @param username User ID or email of user
 * @param password Password to check
 * @param done Callback function
 */
const verify = async (
  req: Request,
  username: string,
  password: string,
  done: Function
) => {
  const { otp } = req.body;

  const isEmail = validateEmail(username);
  const query = isEmail ? { email: username } : { userId: username };

  let user: HydratedDocument<UserType>;
  try {
    user = await userModel.findOne(query);
  } catch (err) {
    return done(null, false, { message: "Failed to fetch user" });
  }

  if (!user) return done(null, false, { message: "User not found" });

  let isPasswordMatch: boolean;
  try {
    isPasswordMatch = await verifyPassword(password, user.passwordHash);
  } catch (err) {
    return done(null, false, { message: "Failed to check password" });
  }

  if (!isPasswordMatch)
    return done(null, false, { message: "Invalid password" });

  if (user.otp.status === "enabled") {
    if (!otp) return done(null, false, { message: "2FA code is required" });

    let optValid: boolean;
    try {
      optValid = verifyOTP(user, otp);
    } catch (err) {
      return done(null, false, { message: "Failed to validate OTP" });
    }

    if (!optValid) return done(null, false, { message: "Invalid OTP" });
  }

  return done(null, user);
};

/**
 * Generates a password reset token.
 *
 * @returns A random token
 */
const getResetToken = () => {
  return crypto
    .randomBytes(PASSWORD_RESET_CONSTANTS.tokenLengthBytes)
    .toString("hex");
};

export interface ChangePasswordToken {
  token: string;
  userId: string;
}

/**
 * Generate a password reset token and add it to the user's reset tokens.
 * Send an email with the token to the user.
 *
 * @param user User who requested a password reset
 * @returns A password reset token
 */
const invokePasswordReset = async (user: HydratedDocument<UserType>) => {
  const token = getResetToken();

  const dbToken = {
    token: token,
    expires: Date.now() + PASSWORD_RESET_CONSTANTS.tokenTTL
  };

  await userModel.updateOne(
    { _id: user._id },
    { $push: { resetTokens: [dbToken] } }
  );

  const resetPayload: ChangePasswordToken = { token, userId: user.userId };
  const resetJWT = jwt.sign(resetPayload, JWT_SECRET);
  const resetLink = `${WEB_CONSTANTS.URL}changepassword?c=${resetJWT}`;

  await sendTemplate(
    user.email.value,
    "resetPassword",
    { name: user.userId, link: resetLink },
    { subject: "Password Reset Request" }
  );

  return resetJWT;
  // TODO: Test
};

export { verifyPassword, hashPassword, verify, invokePasswordReset };
