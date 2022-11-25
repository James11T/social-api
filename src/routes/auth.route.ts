import { Router } from "express";
import {
  authenticateController,
  signUpController,
  forgotPasswordController,
  whoAmIController,
} from "../controllers/auth.controller";
import {
  validateSignIn,
  validateSignUp,
  validateForgotPassword,
} from "../validation/routes/auth.validation";

const authRouter = Router();

authRouter.post("/authenticate", validateSignIn, authenticateController); // TODO: Validation
authRouter.post("/signup", validateSignUp, signUpController);
authRouter.get(
  "/:id/forgot-password/",
  validateForgotPassword, // TODO: Change to central validation
  forgotPasswordController
);
authRouter.get("/whoami", whoAmIController);

// TODO: Update diagram

export default authRouter;
