import isEmail from "validator/lib/isEmail";

/**
 * Check if a email is in valid format
 *
 * @param email An email address to validate
 * @returns True if the email is valid
 */
const validateEmail = (email: string) => isEmail(email);

export { validateEmail };
