import qr from "qrcode";
import { Like } from "typeorm";
import { authenticator } from "otplib";
import { Ok, Err } from "ts-results";
import { TOTP_CONSTANTS } from "../config";
import { sendTemplate } from "../services/ses";
import { countryCodeEmoji } from "country-code-emoji";
import { Friendship, User, UserTOTP } from "../models";
import { FriendshipState } from "../models/friendship.model";
import {
  APIBadRequestError,
  APIServerError,
  APINotFoundError,
  APIUnauthorizedError,
  APIBaseError
} from "../errors/api";
import type { Result } from "ts-results";
import type { Request, Response, NextFunction } from "express";

const { JWT_SECRET } = process.env;

interface FilterQuery {
  username: string;
  limit?: number;
}

/**
 * Find a user based on attributes like name, email, etc.
 *
 * @param req Express request object
 * @param res Express response object
 */
const filterUserController = async (
  req: Request<unknown, unknown, unknown, FilterQuery>,
  res: Response,
  next: NextFunction
) => {
  // TODO: Add pagination
  const { username, limit = 20 } = req.query;

  try {
    const users = await User.find({
      where: {
        username: Like(`%${username}%`)
      },
      take: limit
    });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return next(new APIServerError("Failed to fetch users"));
  }
}; // GET

/**
 * Get a user from their ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const getUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await User.fromId(id);
  if (user.err) return next(new APIServerError("Failed to get user"));
  if (!user.val) return next(new APINotFoundError("User not found"));

  return res.json(user.val);
}; // GET

/**
 * Get all friend requests for a user
 *
 * @param req Express request object
 * @param res Express response object
 */
const getFriendRequestsController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await User.fromId(id);

  if (user.err) return next(new APIServerError("Failed to get user"));
  if (!user.val) return next(new APINotFoundError("User not found"));

  const friendRequests = await user.val.getIncomingFriendRequests();

  if (friendRequests.err) return next(new APIServerError("Failed to get friend requests"));

  return res.json(friendRequests.val);
}; // GET

/**
 * Send a friend request to the specified user as the currently authenticated user
 *
 * @param req Express request object
 * @param res Express response object
 */
const sendFriendRequestsController = async (req: Request, res: Response, next: NextFunction) => {
  const { from: fromId, to: toId } = req.body;

  if (fromId === toId) return next(new APIBadRequestError("Cannot send a friend request to yourself"));

  const fromUser = await User.fromId(fromId);
  const toUser = await User.fromId(toId);

  if (fromUser.err || toUser.err) return next(new APIServerError("Failed to get users"));
  if (!fromUser.val) return next(new APINotFoundError("Friend request sender not found"));
  if (!toUser.val) return next(new APINotFoundError("Friend request recipient not found"));

  // Double check incase of formatting
  if (fromUser.val.id === toUser.val.id)
    return next(new APIBadRequestError("Cannot send a friend request to yourself"));

  const friendshipState = await Friendship.getFriendshipState(fromUser.val, toUser.val);

  if (friendshipState.err) return next(new APIServerError("Failed to check friendship status"));

  if (friendshipState.val === FriendshipState.PENDING) {
    return next(new APIBadRequestError("You already have a friend request from this user"));
  } else if (friendshipState.val === FriendshipState.FRIENDS) {
    return next(new APIBadRequestError("You are already friends with this user"));
  }

  try {
    const newFriendship = new Friendship();
    newFriendship.userFromId = fromUser.val.id;
    newFriendship.userToId = toUser.val.id;
    newFriendship.sentAt = new Date();
    await newFriendship.save();

    return res.json({ success: true });
  } catch (err) {
    return next(new APIServerError("Failed to create friend request"));
  }

  // TODO: Test
}; // POST

/**
 * Get all friends for a user
 *
 * @param req Express request object
 * @param res Express response object
 */
const getUserFriendsController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await User.fromId(id);

  if (user.err) return next(new APIServerError("Failed to get user"));
  if (!user.val) return next(new APINotFoundError("User not found"));

  const friends = await user.val.getFriends();

  if (friends.err) return next(new APIServerError("Failed to get friend requests"));

  return res.json(friends.val);
  // TODO: Test
}; // GET

const isUsernameTakenController = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;

  const user = await User.fromUsername(username);
  if (user.err) return next(new APIServerError("Failed to check username"));

  return res.json({ available: Boolean(user.val) });

  // TODO: Test
}; // GET

/**
 * Used to generate a 2FA secret and store in it in the database
 * Sends QR code and secret to the client
 */
const create2FA = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await User.fromId(id);
  if (user.err) return next(new APIServerError("Failed to fetch user"));
  if (!user.val) return next(new APINotFoundError("User not found"));

  const secret = authenticator.generateSecret();

  const newTOTP = new UserTOTP();
  newTOTP.user = user.val;
  newTOTP.secret = secret;

  try {
    await newTOTP.save();
  } catch (err) {
    return next(new APIServerError("Failed to generate new TOTP instance"));
  }

  const TOTPUrl = authenticator.keyuri(user.val.email, TOTP_CONSTANTS.SERVICE, secret);

  let userQR: string;
  try {
    userQR = await qr.toDataURL(TOTPUrl);
  } catch (err) {
    return next(new APIServerError("Failed to generate 2FA QR code"));
  }

  return res.json({ qr: userQR, secret });
  // TODO: Test
}; // GET

const setTotpActive = async (
  userId: string,
  totpId: string,
  totp: string,
  active: boolean
): Promise<Result<[User, UserTOTP], APIServerError | APIUnauthorizedError>> => {
  const user = await User.fromId(userId);
  if (user.err || !user.val) return Err(new APIServerError("Failed to fetch user"));

  const userTOTP = await UserTOTP.byId(totpId, user.val);
  if (userTOTP.err || !userTOTP.val) return Err(new APIServerError("Failed to fetch user totp"));

  const isValid = userTOTP.val.checkCode(totp);
  if (isValid.err) return Err(new APIServerError("Failed to check TOTP"));

  if (!isValid.val) return Err(new APIUnauthorizedError("Invalid TOTP"));

  userTOTP.val.activated = active;
  const saveResult = await userTOTP.val.saveProxy();
  if (saveResult.err) return Err(new APIServerError("Failed to update TOTP settings"));

  return Ok([user.val, userTOTP.val]);
};

/**
 * Used to verify 2FA secret and set the TOTP status to enabled
 */
const activate2FA = async (
  req: Request<{ id: string }, unknown, { totp: string; totpId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { totp, totpId } = req.body;

  const activateTOTPResult = await setTotpActive(id, totpId, totp, true);
  if (activateTOTPResult.err) return next(activateTOTPResult.val);

  const [user] = activateTOTPResult.val;

  try {
    await sendTemplate(
      user.email,
      "2FAEnabled",
      {
        name: user.username,
        request: {
          ip: req.realIp,
          flag: countryCodeEmoji(req.country)
        }
      },
      { subject: "A new 2FA source has been activated on your account" }
    );
  } catch {
    console.error("Failed to send email");
  }

  return res.json({ success: true });

  // TODO: Test
}; // POST

/**
 * Used to verify 2FA secret and set the TOTP status to enabled
 */
const disable2FA = async (
  req: Request<{ id: string }, unknown, { totp: string; totpId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { totp, totpId } = req.body;

  const activateTOTPResult = await setTotpActive(id, totpId, totp, false);
  if (activateTOTPResult.err) return next(activateTOTPResult.val);

  const [user] = activateTOTPResult.val;

  try {
    await sendTemplate(
      user.email,
      "2FADisabled",
      {
        name: user.username,
        request: {
          ip: req.realIp,
          flag: countryCodeEmoji(req.country)
        }
      },
      { subject: "2FA Disabled" }
    );
  } catch {
    console.error("Failed to send email");
  }

  return res.json({ success: true });

  // TODO: Test
}; // POST

export {
  filterUserController,
  getUserController,
  getFriendRequestsController,
  sendFriendRequestsController,
  getUserFriendsController,
  isUsernameTakenController,
  create2FA,
  activate2FA,
  disable2FA
};
