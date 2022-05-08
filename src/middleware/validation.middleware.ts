import express from "express";
import * as yup from "yup";

type RequestField = "query" | "body" | "params";
type FailAction =
  | {
      action: "reject";
    }
  | {
      action: "redirect";
      to: string;
    };

/**
 * Middleware factory to validate a request against a schema
 *
 * @param schema The schema to validate against
 * @param field The field to validate on the request object
 * @param onFail The action to take if the request fails
 *
 * @returns A middleware function that validates the request
 */
const validateRequest =
  (
    schema: yup.AnyObjectSchema,
    field: RequestField,
    onFail: FailAction = { action: "reject" }
  ) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const parsed = schema.validateSync(req[field]);
      req[field] = parsed;

      return next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        if (onFail.action === "reject") {
          return res.status(400).json({
            error: `Invalid entries in ${field}`,
            errors: error.errors
          });
        } else if (onFail.action === "redirect") {
          return res.redirect(onFail.to);
        }
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  };

/**
 * Validates a requests query field against a schema
 *
 * @param schema The schema to validate against
 * @param onFail The action to take if the request fails
 * @returns A middleware function that validates the requests query
 */
const validateQuery = (schema: yup.AnyObjectSchema, onFail?: FailAction) =>
  validateRequest(schema, "query", onFail);

/**
 * Validates a requests params field against a schema
 *
 * @param schema The schema to validate against
 * @param onFail The action to take if the request fails
 * @returns A middleware function that validates the requests query
 */
const validateParams = (schema: yup.AnyObjectSchema, onFail?: FailAction) =>
  validateRequest(schema, "params", onFail);

/**
 * Validates a requests body field against a schema
 *
 * @param schema The schema to validate against
 * @param onFail The action to take if the request fails
 * @returns A middleware function that validates the requests query
 */
const validateBody = (schema: yup.AnyObjectSchema, onFail?: FailAction) =>
  validateRequest(schema, "body", onFail);

export default validateRequest;
export { validateRequest, validateQuery, validateParams, validateBody };
