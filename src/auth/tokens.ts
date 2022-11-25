import { Ok, Err } from "ts-results";
import { uuid } from "../utils/strings";
import { getEpoch } from "../utils/time";
import { RefreshToken } from "../models";
import { REFRESH_TOKEN_CONSTANTS, ACCESS_TOKEN_CONSTANTS } from "../config";
import type { Result } from "ts-results";
import type { User } from "../models/user.model";
import type { JWTRefreshToken, JWTAccessToken } from "../types";

type GENERATE_ACCESS_TOKEN_ERRORS =
  | "REFRESH_TOKEN_EXPIRED"
  | "FAILED_TO_GET_REFRESH_TOKEN"
  | "REFRESH_TOKEN_REVOKED"
  | "INVALID_REFRESH_TOKEN";

const generateAccessToken = async (
  user: User,
  refreshToken: JWTRefreshToken
): Promise<Result<JWTAccessToken, GENERATE_ACCESS_TOKEN_ERRORS>> => {
  if (refreshToken.exp < getEpoch()) return Err("REFRESH_TOKEN_EXPIRED");
  
  let DBRefreshToken: RefreshToken | null;

  try {
    DBRefreshToken = await RefreshToken.findOne({ where: { id: refreshToken.jti } });
  } catch {
    return Err("FAILED_TO_GET_REFRESH_TOKEN");
  }

  if (!DBRefreshToken) return Err("FAILED_TO_GET_REFRESH_TOKEN");

  if (DBRefreshToken.subjectId !== user.id) return Err("INVALID_REFRESH_TOKEN");

  if (DBRefreshToken.isRevoked) return Err("REFRESH_TOKEN_REVOKED");

  const now = getEpoch();

  const data: JWTAccessToken = {
    refresh_jti: DBRefreshToken.id,
    sub: user.id,
    exp: now + ACCESS_TOKEN_CONSTANTS.TOKEN_TTL,
    iat: now
  };

  return Ok(data);
};

const generateRefreshToken = async (user: User, scope: string): Promise<[JWTRefreshToken, string]> => {
  const tokenId = uuid();
  const now = getEpoch();

  const data = {
    jti: tokenId,
    sub: user.id,
    iat: now,
    exp: now + REFRESH_TOKEN_CONSTANTS.TOKEN_TTL,
    scp: scope
  };

  return [data, tokenId];
};

export { generateAccessToken, generateRefreshToken };
