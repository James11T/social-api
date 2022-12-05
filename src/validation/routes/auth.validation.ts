import { body, param } from "express-validator";
import { validateUserId, validatePassword } from "../../validation/data";
import validateRequest from "../../middleware/validation.middleware";

const passwordErrorMessage =
  "Password must be greater than 8 characters long and meet the minimum password requirements";

const passwordVerifier = (password: string) => validatePassword(password);

const validateSignIn = [
  body("email").exists().withMessage("Email must be supplied"),
  body("password").notEmpty().withMessage("Password cannot be empty"),
  body("totp")
    .optional()
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage("TOTP is in invalid format"),
  validateRequest
];

const validateSignUp = [
  body("username")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .custom(validateUserId)
    .withMessage(
      "Username must be between 3 and 32 characters long and not contain spaces or repeated and trailing ._-"
    ),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Email is not a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .custom(passwordVerifier)
    .withMessage(passwordErrorMessage),
  validateRequest
];

const validateForgotPassword = [
  param("email").exists().notEmpty(),
  validateRequest
];

const validateChangePassword = [
  body("email").notEmpty(),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .custom(passwordVerifier)
    .withMessage(passwordErrorMessage),
  body("resetToken").notEmpty().withMessage("Reset token is required"),
  validateRequest
];

const validateTotp = [
  body("totp")
    .notEmpty()
    .withMessage("TOTP is required")
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage("TOTP must be 6 numbers"),
  validateRequest
];

export {
  validateSignIn,
  validateSignUp,
  validateForgotPassword,
  validateChangePassword,
  validateTotp
};
