import JWT, { TokenExpiredError } from "jsonwebtoken";
import { Err, Ok } from "ts-results";
import type { Result } from "ts-results";

const { JWT_SECRET } = process.env;

const signToken = (payload: any): Result<string, "SIGN_TOKEN_ERROR"> => {
  try {
    const token = JWT.sign(payload, JWT_SECRET);
    return Ok(token);
  } catch (err) {
    console.error(err);

    return Err("SIGN_TOKEN_ERROR");
  }
};

const decodeSignedToken = <T>(
  token: string
): Result<T, "INVALID_TOKEN" | "TOKEN_EXPIRED"> => {
  try {
    const decoded = JWT.verify(token, JWT_SECRET, {
      algorithms: ["HS256"]
    }) as T;

    return Ok(decoded);
  } catch (error) {
    if (error instanceof TokenExpiredError) return Err("TOKEN_EXPIRED");
    return Err("INVALID_TOKEN");
  }
};

export { signToken, decodeSignedToken };
