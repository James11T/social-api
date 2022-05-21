import { query } from "express-validator";
import validateRequest from "../../middleware/validation.middleware";

export const validateUserQuery = [
  query("userid").notEmpty().withMessage("User ID must be supplied"),
  validateRequest
];
