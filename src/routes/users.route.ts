import { Router } from "express";
import {
  filterUserController,
  getUserController,
  getFriendRequestsController,
  sendFriendRequestsController,
  getUserFriendsController
} from "../controllers/users.controller";

const usersRouter = Router();

usersRouter.get("/", filterUserController);
usersRouter.get("/:userId", getUserController);

usersRouter.get("/:userId/friendRequests", getFriendRequestsController);
usersRouter.post("/:userId/friendRequest", sendFriendRequestsController);

usersRouter.get("/:userId/friendRequests", getUserFriendsController);

export default usersRouter;
