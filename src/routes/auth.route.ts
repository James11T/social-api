import { Router } from "express";
import {
  signInController,
  signUpController,
  forgotPasswordController,
  whoAmIController
} from "../controllers/auth.controller";
import { validateSignIn, validateSignUp, validateForgotPassword } from "../validation/routes/auth.validation";

const authRouter = Router();

authRouter.post("/signin", validateSignIn, signInController);
authRouter.post("/signup", validateSignUp, signUpController);
authRouter.get(
  "/:id/forgot-password/",
  validateForgotPassword, // TODO: Change to central validation
  forgotPasswordController
);
authRouter.get("/whoami", whoAmIController);

// TODO: Update diagram

export default authRouter;
