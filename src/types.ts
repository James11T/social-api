interface JWTAccessToken {
  refresh_jti: string;
  sub: string; // Subject
  exp: number; // Expires at
  iat: number; // Issued at
}

interface JWTRefreshToken {
  jti: string; // Unique token ID
  sub: string; // Subject
  exp: number; // Expires at
  iat: number; // Issued at
  scp: string; // Scope
}

export type { JWTAccessToken, JWTRefreshToken };
