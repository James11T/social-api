import { argon2id } from "argon2";

const { NODE_ENV, SEND_EMAILS_IN_DEV } = process.env;

const sendEmailsInDev = SEND_EMAILS_IN_DEV === "true";

export interface PasswordRequirements {
  minPasswordLength?: number;
  maxPasswordLength?: number;
  minSpecialCharacters?: number;
  minNumbers?: number;
  mustVaryCase?: boolean;
  nonSpecialCharacters?: RegExp;
}

export const HASHING_CONSTANTS = {
  SALT_SIZE_BYTES: 16,
  HASH_LENGTH_BYTES: 32,
  HASHING_FUNCTION: argon2id
};

export const PASSWORD_CONSTANTS: PasswordRequirements = {
  minPasswordLength: 8,
  maxPasswordLength: 256,
  minSpecialCharacters: 0,
  minNumbers: 0,
  mustVaryCase: false,
  nonSpecialCharacters: /[a-zA-Z0-9 ]/g
};

export const USER_ID_CONSTANTS = {
  minUserIdLength: 3,
  maxUserIdLength: 32,
  allowedChars: /[a-zA-Z0-9-_.]/g,
  matchRegex: /^(?=.{3,32}$)(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+([^._\s-])$/
};

const isDevelopmentEnv = NODE_ENV === "DEVELOPMENT";

export const RUNTIME_CONSTANTS = {
  IS_DEV: isDevelopmentEnv,
  CAN_SEND_EMAILS: !isDevelopmentEnv || (isDevelopmentEnv && sendEmailsInDev)
};

export const WEB_CONSTANTS = {
  URL: "https://kakaposocial.com/"
};

export const PASSWORD_RESET_CONSTANTS = {
  tokenTTL: 1 * 60 * 60 * 1000, // 1 hour
  tokenLengthBytes: 64
};
