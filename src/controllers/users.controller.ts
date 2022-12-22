import qr from "qrcode";
import { Like } from "typeorm";
import { Ok, Err } from "ts-results";
import { authenticator } from "otplib";
import { User, UserTOTP } from "../models";
import * as APIErrors from "../errors/api";
import { hashPassword } from "../auth/password";
import { sendTemplate } from "../email/templates";
import { TOTP_CONSTANTS, WEB_CONSTANTS } from "../config";
import { getVerificationToken } from "../email/verification";
import * as userRequestSchemas from "../validation/users.validation";
import type { Result } from "ts-results";
import type { Response, NextFunction } from "express";
import type { ValidatedRequest } from "../middleware/validation.middleware";

/**
 * Find a user based on attributes like name, email, etc.
 */
const filterUserController = async (
  req: ValidatedRequest<typeof userRequestSchemas.filterUserSchema>,
  res: Response,
  next: NextFunction
) => {
  const { username, limit = 20 } = req.query;

  try {
    const users = await User.find({
      where: {
        username: Like(`%${username}%`),
      },
      take: Number(limit),
    });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return next(new APIErrors.APIServerError("Failed to fetch users"));
  }
};

/**
 * Get a user from their username
 */
const getUserController = async (
  req: ValidatedRequest<typeof userRequestSchemas.getUserSchema>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;

  const user = await User.fromUsername(username);
  if (user.err) return next(new APIErrors.APIServerError("Failed to get user"));
  if (!user.val) return next(new APIErrors.APINotFoundError("User not found"));

  await user.val.isFriendsWith(user.val);

  return res.json(user.val);
};

/**
 * Create a new user from the request body
 */
const createUserController = async (
  req: ValidatedRequest<typeof userRequestSchemas.createUserSchema>,
  res: Response,
  next: NextFunction
) => {
  if (req.user) return next(new APIErrors.APIBadRequestError("Cannot sign up while authenticated"));

  const { username, email, password } = req.body;

  const getUsername = await User.fromUsername(username);
  if (getUsername.err)
    return next(new APIErrors.APIServerError("Failed to check username availability"));

  if (getUsername.val) return next(new APIErrors.APIConflictError("Username is taken or reserved"));

  const getEmail = await User.fromEmail(email);
  if (getEmail.err) return next(new APIErrors.APIServerError("Failed to check email status"));

  if (getEmail.val) return next(new APIErrors.APIConflictError("Email is already in use"));

  const passwordHash = await hashPassword(password);
  if (passwordHash.err) {
    return next(new APIErrors.APIServerError("Failed to hash password"));
  }

  const verificationToken = getVerificationToken();

  const newUser = new User();
  newUser.username = username;
  newUser.displayName = username;
  newUser.email = email;
  newUser.registeredAt = new Date();
  newUser.passwordHash = passwordHash.val;

  const saveResult = await newUser.pcallSave();

  if (saveResult.err) {
    return next(new APIErrors.APIServerError("Failed to create user"));
  }

  try {
    await sendTemplate(
      email,
      "confirmEmail",
      {
        name: username,
        link: `${WEB_CONSTANTS.URL}email/verify?c=${verificationToken}`,
      },
      { subject: "Confirm your email" }
    );
  } catch (err) {
    console.error(err);

    return next(new APIErrors.APIServerError("Failed to send confirmation email"));
  }

  return res.json({ success: true, id: newUser.id });
};

/**
 * Get all friends for a user
 */
const getUserFriendsController = async (
  req: ValidatedRequest<typeof userRequestSchemas.getUserFriendsSchema>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;

  const user = await User.fromId(username);

  if (user.err) return next(new APIErrors.APIServerError("Failed to get user"));
  if (!user.val) return next(new APIErrors.APINotFoundError("User not found"));

  const friends = await user.val.getFriends();

  if (friends.err) return next(new APIErrors.APIServerError("Failed to get friend requests"));

  return res.json(friends.val);
};

const isUsernameAvailableController = async (
  req: ValidatedRequest<typeof userRequestSchemas.isUsernameAvailableSchema>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;

  const user = await User.fromUsername(username);
  if (user.err) return next(new APIErrors.APIServerError("Failed to check username"));

  return res.json({ available: !user.val });
};

/**
 * Used to generate a 2FA secret and store in it in the database
 * Sends QR code and secret to the client
 */
const create2FA = async (
  req: ValidatedRequest<typeof userRequestSchemas.create2FASchema>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;

  const user = await User.fromUsername(username);
  if (user.err) return next(new APIErrors.APIServerError("Failed to fetch user"));
  if (!user.val) return next(new APIErrors.APINotFoundError("User not found"));

  const secret = authenticator.generateSecret();

  const newTOTP = new UserTOTP();
  newTOTP.user = user.val;
  newTOTP.secret = secret;

  try {
    await newTOTP.save();
  } catch (err) {
    return next(new APIErrors.APIServerError("Failed to generate new TOTP instance"));
  }

  const TOTPUrl = authenticator.keyuri(user.val.email, TOTP_CONSTANTS.SERVICE, secret);

  let userQR: string;
  try {
    userQR = await qr.toDataURL(TOTPUrl);
  } catch (err) {
    return next(new APIErrors.APIServerError("Failed to generate 2FA QR code"));
  }

  return res.json({ qr: userQR, secret, totpId: newTOTP.id });
};

const setTotpActive = async (
  username: string,
  totpId: string,
  totp: string,
  active: boolean
): Promise<Result<[User, UserTOTP], APIErrors.APIServerError | APIErrors.APIUnauthorizedError>> => {
  const user = await User.fromUsername(username);
  if (user.err || !user.val) return Err(new APIErrors.APIServerError("Failed to fetch user"));

  const userTOTP = await UserTOTP.byId(totpId, user.val);
  if (userTOTP.err || !userTOTP.val)
    return Err(new APIErrors.APIServerError("Failed to fetch user totp"));

  const isValid = userTOTP.val.checkCode(totp);
  if (isValid.err) return Err(new APIErrors.APIServerError("Failed to check TOTP"));

  if (!isValid.val) return Err(new APIErrors.APIUnauthorizedError("Invalid TOTP"));

  userTOTP.val.activated = active;
  const saveResult = await userTOTP.val.pcallSave();
  if (saveResult.err) return Err(new APIErrors.APIServerError("Failed to update TOTP settings"));

  return Ok([user.val, userTOTP.val]);
};

/**
 * Used to verify 2FA secret and set the TOTP status to enabled
 */
const activate2FA = async (
  req: ValidatedRequest<typeof userRequestSchemas.activate2FASchema>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;
  const { totp, totpId } = req.body;

  const activateTOTPResult = await setTotpActive(username, totpId, totp, true);
  if (activateTOTPResult.err) return next(activateTOTPResult.val);

  const [user] = activateTOTPResult.val;

  try {
    await sendTemplate(
      user.email,
      "2FAEnabled",
      {
        name: user.username,
        ip: req.realIp,
      },
      { subject: "A new 2FA source has been activated on your account" }
    );
  } catch (err) {
    console.error(err);
    console.error("Failed to send email");
  }

  return res.json({ success: true });
};

/**
 * Used to verify 2FA secret and set the TOTP status to enabled
 */
const deactivate2FA = async (
  req: ValidatedRequest<typeof userRequestSchemas.deactivate2FASchema>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;
  const { totp, totpId } = req.body;

  const activateTOTPResult = await setTotpActive(username, totpId, totp, false);
  if (activateTOTPResult.err) return next(activateTOTPResult.val);

  const [user] = activateTOTPResult.val;

  try {
    await sendTemplate(
      user.email,
      "2FADisabled",
      {
        name: user.username,
        ip: req.realIp,
      },
      { subject: "2FA Disabled" }
    );
  } catch {
    console.error("Failed to send email");
  }

  return res.json({ success: true });
};

const getTOTP_IDs = async (
  req: ValidatedRequest<typeof userRequestSchemas.getTOTP_IDsSchema>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;

  const user = await User.fromUsername(username);
  if (user.err) return next(new APIErrors.APIServerError("Failed to fetch user"));
  if (!user.val) return next(new APIErrors.APINotFoundError("User not found"));

  try {
    const userTOTPs = await UserTOTP.find({
      where: { user: { id: user.val.id }, activated: true },
    });
    return res.json(userTOTPs.map((userTOTP) => ({ totpId: userTOTP.id })));
  } catch (err) {
    console.error(err);
    return next(new APIErrors.APIServerError("Failed to fetch 2FA"));
  }
};

export {
  filterUserController,
  getUserController,
  createUserController,
  getUserFriendsController,
  isUsernameAvailableController,
  create2FA,
  activate2FA,
  deactivate2FA,
  getTOTP_IDs,
};
