import { argon2id } from "argon2";

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
