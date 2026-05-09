import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}

export function validate(
  schema: ZodSchema,
  source: "body" | "query" | "params" = "body",
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source]);
      req.validated = { ...req.validated, [source]: data };
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateMultiple(schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result: NonNullable<Request["validated"]> = {};
      for (const source of ["body", "query", "params"] as const) {
        const schema = schemas[source];
        if (schema) {
          result[source] = schema.parse(req[source]);
        }
      }
      req.validated = { ...req.validated, ...result };
      next();
    } catch (error) {
      next(error);
    }
  };
}
