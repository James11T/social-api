import { Router } from "express";
import {
  filterUserController,
  getUserController,
  getFriendRequestsController,
  sendFriendRequestsController,
  getUserFriendsController,
  isUserIdAvailabileController
} from "../controllers/users.controller";
import { protect } from "../middleware/auth.middleware";
import { validateUserQuery } from "../validation/routes/users.validation";

const usersRouter = Router();

usersRouter.get("/", validateUserQuery, filterUserController);
usersRouter.get("/:userId", getUserController);

usersRouter.get("/:userId/friends", getUserFriendsController);

usersRouter.get("/:userId/idavailable", isUserIdAvailabileController);

usersRouter.get(
  "/:userId/friends/requests",
  protect,
  getFriendRequestsController
);
usersRouter.post(
  "/:userId/friends/request",
  protect,
  sendFriendRequestsController
);

export default usersRouter;
