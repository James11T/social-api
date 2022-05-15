import isEmail from "validator/lib/isEmail";
import {
  PasswordRequirements,
  PASSWORD_CONSTANTS,
  USER_ID_CONSTANTS
} from "../constants";

/**
 * Check if a email is in valid format
 *
 * @param email An email address to validate
 * @returns True if the email is valid
 */
const validateEmail = (email: string) => isEmail(email);

/**
 * Check a password is valid
 *
 * @param password A password to validate
 * @returns True if the password is valid
 */
const validatePassword = (
  password: string,
  options: PasswordRequirements = {}
) => {
  const mergedOptions = { ...PASSWORD_CONSTANTS, ...options };

  const metrics: boolean[] = [];

  metrics.push(password.length >= mergedOptions.minPasswordLength);

  metrics.push(password.length <= mergedOptions.maxPasswordLength);

  metrics.push(
    password.replace(mergedOptions.nonSpecialCharacters, "").length >=
      mergedOptions.minSpecialCharacters
  );

  metrics.push(password.replace(/\D/g, "").length >= mergedOptions.minNumbers);

  if (mergedOptions.mustVaryCase) {
    const upperCase = password.match(/[A-Z]/g)?.length || 0;
    const lowerCase = password.match(/[a-z]/g)?.length || 0;
    metrics.push(upperCase > 0 && lowerCase > 0);
  }

  return metrics.reduce((prev, curr) => prev && curr, true);
};

/**
 * Check a user id is valid
 *
 * @param userId A user id to validate
 * @returns True if the user id is valid
 */
const validateUserId = (userId: string) => {
  return userId.match(USER_ID_CONSTANTS.matchRegex) !== null;
  // TODO: Test
};

export { validateEmail, validatePassword, validateUserId };
