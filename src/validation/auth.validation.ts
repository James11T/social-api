import { z } from "zod";

const authenticateSchema = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

const refreshAccessSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
    userId: z.string(),
  }),
});

const resetPasswordSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
});

export { authenticateSchema, refreshAccessSchema, resetPasswordSchema };
