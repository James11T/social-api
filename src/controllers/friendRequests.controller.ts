import * as APIErrors from "../errors/api";
import { Friendship, User } from "../models";
import { FriendshipState } from "../models/friendship.model";
import type * as friendRequestSchemas from "../validation/friendRequests.validation";
import type { Response, NextFunction } from "express";
import type { ValidatedRequest } from "../middleware/validation.middleware";

/**
 * Get all friend requests for a user
 */
const getFriendRequestsController = async (
  req: ValidatedRequest<typeof friendRequestSchemas.getFriendRequestsSchema>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;

  const user = await User.fromUsername(username);

  if (user.err) return next(new APIErrors.APIServerError("Failed to get user"));
  if (!user.val) return next(new APIErrors.APINotFoundError("User not found"));

  const friendRequests = await user.val.getIncomingFriendRequests();

  if (friendRequests.err)
    return next(new APIErrors.APIServerError("Failed to get friend requests"));

  return res.json(friendRequests.val);
};

/**
 * Send a friend request to the specified user as the currently authenticated user
 */
const sendFriendRequestController = async (
  req: ValidatedRequest<typeof friendRequestSchemas.sendFriendRequestSchema>,
  res: Response,
  next: NextFunction
) => {
  const { from, to } = req.body;

  const fromUser = await User.fromUsername(from);
  const toUser = await User.fromUsername(to);

  if (fromUser.err || toUser.err) return next(new APIErrors.APIServerError("Failed to get users"));
  if (!fromUser.val) return next(new APIErrors.APINotFoundError("Friend request sender not found"));
  if (!toUser.val)
    return next(new APIErrors.APINotFoundError("Friend request recipient not found"));

  // Double check in case of formatting
  if (fromUser.val.id === toUser.val.id)
    return next(new APIErrors.APIBadRequestError("Cannot send a friend request to yourself"));

  const friendshipState = await Friendship.getFriendshipState(fromUser.val, toUser.val);

  if (friendshipState.err)
    return next(new APIErrors.APIServerError("Failed to check friendship status"));

  if (friendshipState.val === FriendshipState.PENDING) {
    return next(
      new APIErrors.APIBadRequestError("You already have a pending friend request with this user")
    );
  } else if (friendshipState.val === FriendshipState.FRIENDS) {
    return next(new APIErrors.APIBadRequestError("You are already friends with this user"));
  }

  try {
    const newFriendship = new Friendship();
    newFriendship.userFromId = fromUser.val.id;
    newFriendship.userToId = toUser.val.id;
    newFriendship.sentAt = new Date();
    await newFriendship.save();

    return res.json({ success: true });
  } catch (err) {
    return next(new APIErrors.APIServerError("Failed to create friend request"));
  }
};

export { getFriendRequestsController, sendFriendRequestController };
