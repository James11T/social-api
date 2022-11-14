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
  activate2FA
} from "../controllers/users.controller";
import { protect } from "../middleware/auth.middleware";
import { validateUserQuery } from "../validation/routes/users.validation";
import { validateChangePassword, validateTotp } from "../validation/routes/auth.validation";

const usersRouter = Router(); // /users

usersRouter.get("/", validateUserQuery, filterUserController);
usersRouter.get("/:id", getUserController);

usersRouter.get("/:id/username-taken", isUsernameTakenController);

usersRouter.get("/:id/friends", getUserFriendsController);
usersRouter.get("/:id/friends-requests", protect, getFriendRequestsController);
usersRouter.post("/:id/friends-requests", protect, sendFriendRequestsController);

// usersRouter.post("/:id/change-password", validateChangePassword, changePasswordController);

usersRouter.post("/:id/2fa/create", protect, create2FA);
usersRouter.post("/:id/2fa/activate", protect, validateTotp, activate2FA);
usersRouter.post("/:id/2fa/disable", protect, validateTotp, disable2FA);

export default usersRouter;
