import crypto from "crypto";

const TOKEN_LENGTH_BYTES = 32;

const getVerificationToken = () => {
  return crypto.randomBytes(TOKEN_LENGTH_BYTES).toString("hex");
};

export { getVerificationToken };
