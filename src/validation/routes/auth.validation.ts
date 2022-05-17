import { body } from "express-validator";
import { validateUserId, validatePassword } from "../../validation/data";
import validateRequest from "../../middleware/validation.middleware";

export const validateSignUp = [
  body("userId")
    .notEmpty()
    .custom(validateUserId)
    .withMessage(
      "User ID must be between 3 and 32 characters long and not contain spaces or repeated and trailing ._-"
    ),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Email is not a valid email address"),
  body("password")
    .notEmpty()
    .custom((value) => validatePassword(value))
    .withMessage(
      "Password must be greater than 8 characters long and meet the minimum password requirements"
    ),
  validateRequest
];
