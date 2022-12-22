import { Router } from "express";
import {
  getFriendRequestsController,
  sendFriendRequestController
} from "../controllers/friendRequests.controller";
import { protect } from "../middleware/auth.middleware";

const friendRequestsRouter = Router();

friendRequestsRouter.get("/:username", protect, getFriendRequestsController);
friendRequestsRouter.post("/", protect, sendFriendRequestController);

export default friendRequestsRouter;
