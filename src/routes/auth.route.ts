import { Router } from "express";
import {
  signInController,
  signUpController,
  deauthController,
  forgotPasswordController
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signIn", signInController);
authRouter.post("/signUp", signUpController);
authRouter.get("/deauth", deauthController);
authRouter.get("/forgotPassword", forgotPasswordController);

export default authRouter;
