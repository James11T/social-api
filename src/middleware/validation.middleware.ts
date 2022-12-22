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
      console.log(parseResult.error);
      return next(new APIParameterError("", {}));
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
