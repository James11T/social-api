import { Router } from "express";
import {
  authenticateController,
  forgotPasswordController,
  whoAmIController,
  refreshAccessController
} from "../controllers/auth.controller";
import {
  validateSignIn,
  validateForgotPassword
} from "../validation/routes/auth.validation";

const authRouter = Router();

authRouter.post("/authenticate", validateSignIn, authenticateController); // TODO: Validation
authRouter.post("/refresh", refreshAccessController); // TODO: Validation
authRouter.get(
  "/:id/forgot-password/",
  validateForgotPassword, // TODO: Change to central validation
  forgotPasswordController
);
authRouter.get("/whoami", whoAmIController);

// TODO: Update diagram

export default authRouter;
