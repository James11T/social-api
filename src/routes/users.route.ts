import { Router } from "express";
import {
  filterUserController,
  getUserController,
  getFriendRequestController,
  sendFriendRequestController,
  getUserFriendsController
} from "../controllers/users.controller";

const usersRouter = Router();

usersRouter.get("/", filterUserController);
usersRouter.get("/:userId", getUserController);

usersRouter.get("/:userId/friendRequest", getFriendRequestController);
usersRouter.post("/:userId/friendRequest", sendFriendRequestController);

usersRouter.get("/:userId/friendRequest", getUserFriendsController);

export default usersRouter;
