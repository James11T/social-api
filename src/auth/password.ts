import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Ok, Err } from "ts-results";
import { sendTemplate } from "../email/templates";
import { HASHING_CONSTANTS, WEB_CONSTANTS } from "../config";
import type { User } from "../models";
import type { Result } from "ts-results";

const { JWT_SECRET } = process.env;

const hashingOptions = {
  type: HASHING_CONSTANTS.HASHING_FUNCTION,
  hashLength: HASHING_CONSTANTS.HASH_LENGTH_BYTES,
  saltLength: HASHING_CONSTANTS.SALT_SIZE_BYTES,
};

/**
 * Hash a password either with a generated salt.
 *
 * @param password A password to hash
 * @returns A password hash and salt
 */
const hashPassword = async (
  password: string
): Promise<Result<string, "FAILED_TO_HASH_PASSWORD">> => {
  try {
    const hash = await argon2.hash(password, hashingOptions);
    return Ok(hash);
  } catch {
    return Err("FAILED_TO_HASH_PASSWORD");
  }
};

/**
 * Check that a password matches a given salt and hash.
 *
 * @param password A password to validate
 * @param hash A password hash to validate against
 * @returns True if the password is valid
 */
const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const isValid = await argon2.verify(hash, password, hashingOptions);

  return isValid;
};

const invokePasswordReset = async (user: User) => {
  const resetPayload = { id: user.id };
  const resetJWT = jwt.sign(resetPayload, JWT_SECRET); // TODO: Replace with generic sign
  const resetLink = `${WEB_CONSTANTS.URL}change-password?c=${resetJWT}`;

  await sendTemplate(
    user.email,
    "resetPassword",
    { name: user.username, link: resetLink },
    { subject: "Password Reset Request" }
  );

  return resetJWT;
  // TODO: Test
};

export { verifyPassword, hashPassword, invokePasswordReset };
