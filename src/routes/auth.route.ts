import { Router } from "express";
import {
  signInController,
  signUpController,
  deauthController,
  forgotPasswordController,
  whoAmIController,
  enable2FA,
  activate2FA,
  disable2FA,
  get2FAStatus,
  changePasswordController
} from "../controllers/auth.controller";
import { authenticate, protect } from "../middleware/auth.middleware";
import {
  validateSignIn,
  validateSignUp,
  validateForgotPassword,
  validateChangePassword,
  validateOtp
} from "../validation/routes/auth.validation";

const authRouter = Router();

authRouter.post(
  "/signin",
  validateSignIn,
  authenticate("local"),
  signInController
);
authRouter.post("/signup", validateSignUp, signUpController);
authRouter.get("/deauth", protect, deauthController);
authRouter.get(
  "/forgotpassword/:userId",
  validateForgotPassword, // TODO: Change to central validation
  forgotPasswordController
);
authRouter.get("/whoami", whoAmIController);
authRouter.post(
  "/changepassword",
  validateChangePassword,
  changePasswordController
);

authRouter.post("/2fa/enable", protect, enable2FA);
authRouter.post("/2fa/activate", protect, validateOtp, activate2FA);
authRouter.post("/2fa/disable", protect, validateOtp, disable2FA);
authRouter.get("/2fa/status", protect, get2FAStatus);

// TODO: Update diagram

export default authRouter;
