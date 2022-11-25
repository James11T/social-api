import { Router } from "express";
import {
  filterUserController,
  getUserController,
  getFriendRequestsController,
  sendFriendRequestsController,
  getUserFriendsController,
  isUsernameTakenController,
  create2FA,
  disable2FA,
  activate2FA,
  getTOTP_IDs
} from "../controllers/users.controller";
import { protect } from "../middleware/auth.middleware";
import { validateUserQuery } from "../validation/routes/users.validation";
import { validateChangePassword, validateTotp } from "../validation/routes/auth.validation";

const usersRouter = Router(); // /users

usersRouter.get("/", validateUserQuery, filterUserController);
usersRouter.get("/:id", getUserController);

usersRouter.get("/:username/is-available", isUsernameTakenController);

usersRouter.get("/:id/friends", getUserFriendsController);
usersRouter.get("/:id/friend-requests", protect, getFriendRequestsController);
usersRouter.post("/:id/friend-requests", protect, sendFriendRequestsController);

// usersRouter.post("/:id/change-password", validateChangePassword, changePasswordController);

usersRouter.post("/:id/2fa/create", protect, create2FA);
usersRouter.post("/:id/2fa/activate", protect, validateTotp, activate2FA);
usersRouter.post("/:id/2fa/disable", protect, validateTotp, disable2FA);
usersRouter.post("/:id/2fa/status", protect, getTOTP_IDs);

export default usersRouter;
