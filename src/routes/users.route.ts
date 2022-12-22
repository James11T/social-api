import { Router } from "express";
import {
  filterUserController,
  getUserController,
  createUserController,
  getUserFriendsController,
  isUsernameAvailableController,
  create2FA,
  deactivate2FA,
  activate2FA,
  getTOTP_IDs
} from "../controllers/users.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  activate2FASchema,
  create2FASchema,
  createUserSchema,
  deactivate2FASchema,
  filterUserSchema,
  getTOTP_IDsSchema,
  getUserFriendsSchema,
  getUserSchema,
  isUsernameAvailableSchema
} from "../validation/users.validation";

const usersRouter = Router(); // /users

usersRouter.post("/", validate(createUserSchema), createUserController);
usersRouter.get("/", validate(filterUserSchema), filterUserController);
usersRouter.get("/:username", validate(getUserSchema), getUserController);

usersRouter.get(
  "/:username/is-available",
  validate(isUsernameAvailableSchema),
  isUsernameAvailableController
);

usersRouter.get(
  "/:username/friends",
  validate(getUserFriendsSchema),
  getUserFriendsController
);

// usersRouter.post("/:id/change-password", validateChangePassword, changePasswordController);

usersRouter.post(
  "/:username/2fa/create",
  protect,
  validate(create2FASchema),
  create2FA
);
usersRouter.post(
  "/:username/2fa/activate",
  protect,
  validate(activate2FASchema),
  activate2FA
);
usersRouter.post(
  "/:username/2fa/deactivate",
  protect,
  validate(deactivate2FASchema),
  deactivate2FA
);
usersRouter.post(
  "/:username/2fa/status",
  protect,
  validate(getTOTP_IDsSchema),
  getTOTP_IDs
);

export default usersRouter;
