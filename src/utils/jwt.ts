import JWT from "jsonwebtoken";
import { Err, Ok } from "ts-results";
import type { Result } from "ts-results";

const { JWT_SECRET } = process.env;

type SIGN_TOKEN_ERRORS = "SIGN_TOKEN_ERROR";

const signToken = async (payload: any): Promise<Result<string, SIGN_TOKEN_ERRORS>> => {
  try {
    const token = JWT.sign(payload, JWT_SECRET);
    return Ok(token);
  } catch {
    return Err("SIGN_TOKEN_ERROR");
  }
};

const decodeSignedToken = <T>(token: string): Result<T, "INVALID_TOKEN"> => {
  try {
    const decoded = JWT.verify(token, JWT_SECRET, {
      algorithms: ["HS256"]
    }) as T;

    return Ok(decoded);
  } catch (error) {
    return Err("INVALID_TOKEN");
  }
};

export { signToken, decodeSignedToken };
