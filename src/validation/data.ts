import isEmail from "validator/lib/isEmail";
import { PASSWORD_CONSTANTS, USERNAME_CONSTANTS } from "../config";

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
  options: Partial<typeof PASSWORD_CONSTANTS> = {}
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

  const isValid = metrics.every((metric) => metric);

  return isValid;
};

/**
 * Check a user id is valid
 *
 * @param userId A user id to validate
 * @returns True if the user id is valid
 */
const validateUserId = (userId: string) => {
  if (!userId) return false;
  return userId.match(USERNAME_CONSTANTS.matchRegex) !== null;
  // TODO: Test
};

export { validateEmail, validatePassword, validateUserId };
