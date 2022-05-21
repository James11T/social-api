import { userModel } from "../schemas/user.schema";
import {
  APIBadRequestError,
  APIServerError,
  APINotFoundError
} from "../errors/api";
import mongoose from "mongoose";
import type { NextFunction, Request, Response } from "express";

/**
 * Find a user based on attributes like name, email, etc.
 *
 * @param req Express request object
 * @param res Express response object
 */
const filterUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userid: userId } = req.query;

  try {
    const users = await userModel.find({ userId: new RegExp(`.*${userId}.*`) });
    res.json(users);
  } catch (err) {
    console.error(err);
    return next(new APIServerError());
  }
}; // GET

/**
 * Get a user from their ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const qRes = await userModel.findOne({ userId });
    if (!qRes) return next(new APINotFoundError("User not found"));
    res.json(qRes);
  } catch (err) {
    return next(new APIServerError());
  }
}; // GET

/**
 * Get all friend requests for a user
 *
 * @param req Express request object
 * @param res Express response object
 */
const getFriendRequestsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  let user;
  try {
    user = await userModel.findOne({ userId });
  } catch (err) {
    return next(new APIServerError("Failed to fetch user"));
  }

  if (!user) return next(new APINotFoundError("User not found"));

  const friendRequests = user.friends
    .filter((friend) => friend.status === "pendingInbound")
    .map((friend) => friend.userId);

  return res.json(friendRequests);
}; // GET

/**
 * Send a friend request to the specified user as the currently authenticated user
 *
 * @param req Express request object
 * @param res Express response object
 */
const sendFriendRequestsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  let user;
  try {
    user = await userModel.findOne({ userId });
  } catch (err) {
    return next(new APIServerError("Failed to fetch user"));
  }

  if (!user) return next(new APINotFoundError("User not found"));

  if (user._id === req.user._id)
    return next(
      new APIBadRequestError("Cannot send a friend request to yourself")
    );

  const existingFriendStatus = req.user.friends.find(
    (friend) => friend.userId === userId
  );

  if (existingFriendStatus) {
    if (existingFriendStatus.status === "pendingInbound") {
      return next(
        new APIBadRequestError(
          "You already have a friend request from this user"
        )
      );
    } else if (existingFriendStatus.status === "friend") {
      return next(
        new APIBadRequestError("You are already friends with this user")
      );
    }
  }

  const friendRequestOutbound = {
    userId,
    status: "pendingOutbound"
  };

  const friendRequestInbound = {
    userId: req.user.userId,
    status: "pendingInbound"
  };

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await req.user.updateOne({
      $push: { friends: friendRequestOutbound }
    });

    await user.updateOne({
      $push: { friends: friendRequestInbound }
    });
    session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    return next(new APIServerError("Failed to send friend request"));
  }

  return res.json({ success: true });

  // TODO: Test
}; // POST

/**
 * Get all friends for a user
 *
 * @param req Express request object
 * @param res Express response object
 */
const getUserFriendsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  let user;
  try {
    user = await userModel.findOne({ userId });
  } catch (err) {
    return next(new APIServerError("Failed to fetch user"));
  }

  if (!user) return next(new APINotFoundError("User not found"));

  const friends = user.friends
    .filter((friend) => friend.status === "friend")
    .map((friend) => friend.userId);

  return res.json(friends);
  // TODO: Test
}; // GET

const isUserIdAvailabileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  let isAvailable: boolean;
  try {
    isAvailable = !(await userModel.exists({ userId }));
  } catch (err) {
    return next(new APIServerError("Failed to check user ID availability"));
  }

  return res.json({ available: isAvailable });

  // TODO: Test
}; // GET

export {
  filterUserController,
  getUserController,
  getFriendRequestsController,
  sendFriendRequestsController,
  getUserFriendsController,
  isUserIdAvailabileController
};
