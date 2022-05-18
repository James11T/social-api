import speakeasy from "speakeasy";
import { UserType } from "../schemas/user.schema";

const verifyOTP = (user: UserType, otp: string) => {
  return speakeasy.totp.verify({
    secret: user.otp.secret,
    token: otp,
    encoding: "base32"
  });
};

export { verifyOTP };
