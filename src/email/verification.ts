import crypto from "crypto";

const TOKEN_LENGTH_BYTES = 32;

const getVerificationToken = (length = TOKEN_LENGTH_BYTES) => {
  return crypto.randomBytes(length).toString("hex");
};

export { getVerificationToken };
