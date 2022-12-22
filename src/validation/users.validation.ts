import { z } from "zod";
import { USERNAME_CONSTANTS, PASSWORD_CONSTANTS } from "../config";

const createUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(USERNAME_CONSTANTS.minUsernameLength)
      .max(USERNAME_CONSTANTS.maxUsernameLength)
      .regex(USERNAME_CONSTANTS.matchRegex),
    email: z.string().email(),
    password: z
      .string()
      .min(PASSWORD_CONSTANTS.minPasswordLength)
      .max(PASSWORD_CONSTANTS.maxPasswordLength),
  }),
});

const filterUserSchema = z.object({
  query: z.object({
    username: z.string(),
    limit: z.string().regex(/\d+/g).optional(),
  }),
});

const getUserSchema = z.object({
  params: z.object({
    username: z.string(),
  }),
});

const isUsernameAvailableSchema = z.object({
  params: z.object({
    username: z.string(),
  }),
});

const getUserFriendsSchema = z.object({
  params: z.object({ username: z.string() }),
});

const create2FASchema = z.object({
  params: z.object({ username: z.string() }),
});

const activate2FASchema = z.object({
  params: z.object({ username: z.string() }),
  body: z.object({ totp: z.string().length(6), totpId: z.string() }),
});

const deactivate2FASchema = z.object({
  params: z.object({ username: z.string() }),
  body: z.object({ totp: z.string().length(6), totpId: z.string() }),
});

const getTOTP_IDsSchema = z.object({
  params: z.object({ username: z.string() }),
});

export {
  createUserSchema,
  filterUserSchema,
  getUserSchema,
  isUsernameAvailableSchema,
  getUserFriendsSchema,
  create2FASchema,
  activate2FASchema,
  deactivate2FASchema,
  getTOTP_IDsSchema,
};
