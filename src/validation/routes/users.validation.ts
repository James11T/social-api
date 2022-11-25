import { query } from "express-validator";
import validateRequest from "../../middleware/validation.middleware";

const validateUserQuery = [
  query("username").notEmpty().withMessage("User ID must be supplied"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100"),
  validateRequest,
];

export { validateUserQuery };
