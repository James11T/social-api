import { argon2id } from "argon2";
import bytes from "bytes";
import parseDuration from "parse-duration";

const { NODE_ENV, SEND_EMAILS_IN_DEV } = process.env;

const isDevelopmentEnv = NODE_ENV.toUpperCase() === "DEVELOPMENT";
const sendEmailsInDev = SEND_EMAILS_IN_DEV === "true";

export const HASHING_CONSTANTS = {
  SALT_SIZE_BYTES: 16,
  HASH_LENGTH_BYTES: 32,
  HASHING_FUNCTION: argon2id,
};

export const PASSWORD_CONSTANTS = {
  minPasswordLength: 8,
  maxPasswordLength: 256,
  minSpecialCharacters: 0,
  minNumbers: 0,
  mustVaryCase: false,
  nonSpecialCharacters: /[a-zA-Z0-9 ]/g,
};

export const USERNAME_CONSTANTS = {
  minUsernameLength: 3,
  maxUsernameLength: 32,
  allowedChars: /[a-zA-Z0-9-_.]/g,
  matchRegex: /^(?=.{3,32}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+([^._\s-])$/,
};

export const RUNTIME_CONSTANTS = {
  IS_DEV: isDevelopmentEnv,
  CAN_SEND_EMAILS: !isDevelopmentEnv || (isDevelopmentEnv && sendEmailsInDev),
};

export const WEB_CONSTANTS = {
  URL: "https://kakaposocial.com/",
  MAIL_SUBDOMAIN: "mail",
  MEDIA_SUBDOMAIN: "media",
};

export const PASSWORD_RESET_CONSTANTS = {
  tokenTTL: parseDuration("1hr", "ms"), // 1 hour
  tokenLengthBytes: 64,
};

export const POST_CONSTANTS = {
  MAX_MEDIA_COUNT: 8,
  MAX_MEDIA_SIZE: bytes.parse("50MB"),
  ALLOWED_MEDIA_TYPES: ["image/jpeg", "image/png"],
};

export const REFRESH_TOKEN_CONSTANTS = {
  TOKEN_TTL: parseDuration("60day", "s"),
};

export const ACCESS_TOKEN_CONSTANTS = {
  TOKEN_TTL: parseDuration("1hr", "s"),
};

export const TOTP_CONSTANTS = {
  SERVICE: "Kakapo",
};
