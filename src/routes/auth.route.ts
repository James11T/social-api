import { Router } from "express";
import {
  authenticateController,
  resetPasswordController,
  whoAmIController,
  refreshAccessController,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import {
  authenticateSchema,
  refreshAccessSchema,
  resetPasswordSchema,
} from "../validation/auth.validation";

const authRouter = Router();

authRouter.post("/authenticate", validate(authenticateSchema), authenticateController);
authRouter.post("/refresh", validate(refreshAccessSchema), refreshAccessController);
authRouter.get("/:userId/reset-password/", validate(resetPasswordSchema), resetPasswordController);
authRouter.get("/whoami", whoAmIController);

export default authRouter;
