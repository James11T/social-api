import { body, param } from "express-validator";
import { validateUserId, validatePassword } from "../../validation/data";
import validateRequest from "../../middleware/validation.middleware";

const passwordErrorMessage =
  "Password must be greater than 8 characters long and meet the minimum password requirements";

const passwordVerifer = (password: string) => validatePassword(password);

export const validateSignIn = [
  body("userId").exists().withMessage("User ID must be supplied"),
  body("password").notEmpty().withMessage("Password cannot be empty"),
  body("otp").optional().isNumeric().withMessage("OTP is in invalid format"),
  validateRequest
];

export const validateSignUp = [
  body("userId")
    .notEmpty()
    .withMessage("User ID cannot be empty")
    .custom(validateUserId)
    .withMessage(
      "User ID must be between 3 and 32 characters long and not contain spaces or repeated and trailing ._-"
    ),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Email is not a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .custom(passwordVerifer)
    .withMessage(passwordErrorMessage),
  validateRequest
];

export const validateForgotPassword = [
  param("userId").exists().notEmpty(),
  validateRequest
];

export const validateChangePassword = [
  body("userId").notEmpty(),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .custom(passwordVerifer)
    .withMessage(passwordErrorMessage),
  body("resetToken").notEmpty().withMessage("Reset token is required"),
  validateRequest
];

export const validateOtp = [
  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 numbers"),
  validateRequest
];
