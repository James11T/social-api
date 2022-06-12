import { query } from "express-validator";
import validateRequest from "../../middleware/validation.middleware";

export const validateUserQuery = [
  query("userid").notEmpty().withMessage("User ID must be supplied"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be an integer greater than 0"),
  validateRequest
];
