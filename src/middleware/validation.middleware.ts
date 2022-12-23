import { APIParameterError } from "../errors/api";
import type { z, ZodObject } from "zod";
import type { Request, Response, NextFunction } from "express";

type ValidationSchema = ZodObject<{
  params?: any;
  body?: any;
  query?: any;
}>;

const validate =
  (schema: ValidationSchema) => async (req: Request, res: Response, next: NextFunction) => {
    const parseResult = await schema.safeParseAsync(req);

    if (!parseResult.success) {
      const processedErrors = parseResult.error.issues.map((issue) => ({
        location: issue.path.join("."),
        message: issue.message,
        type: issue.code,
      }));
      return next(new APIParameterError("Invalid parameters", processedErrors));
    }

    next();
  };

type ValidatedRequest<
  Schema extends ValidationSchema,
  resBody = any,
  Locals extends Record<string, any> = Record<string, any>
> = Request<
  z.infer<Schema>["params"],
  resBody,
  z.infer<Schema>["body"],
  z.infer<Schema>["query"],
  Locals
>;

export { validate };
export type { ValidatedRequest };
