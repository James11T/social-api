import { userModel } from "../schemas/user.schema";
import type { NextFunction, Request, Response } from "express";
import {
  APIBadRequestError,
  APIServerError,
  APINotFoundError
} from "../errors/api";

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
  const { id } = req.query;

  try {
    const users = await userModel.find({ userId: new RegExp(`.*${id}.*`) });
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

  if (!userId) return next(new APIBadRequestError("No user ID provided"));

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
  try {
    const qRes = await userModel.findOne({ userId });
    if (!qRes) return next(new APINotFoundError("User not found"));

    const friendRequests = qRes.friends
      .filter((friend) => friend.status === "pendingInbound")
      .map((friend) => friend.userId);

    return res.json(friendRequests);
  } catch (err) {
    return next(new APIServerError());
  }
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
  /*
    Get current user
    Check no existing request, inbound or outbound
    Get target user
    Add friend request to both users
  */
  const { userId } = req.params;

  try {
  } catch (err) {
    return next(new APIServerError());
  }
  // TODO: Implement
}; // POST

/**
 * Get all friends for a user
 *
 * @param req Express request object
 * @param res Express response object
 */
const getUserFriendsController = async (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

export {
  filterUserController,
  getUserController,
  getFriendRequestsController,
  sendFriendRequestsController,
  getUserFriendsController
};
