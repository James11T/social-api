import type { Request, Response } from "express";

/**
 * Find a user based on attributes like name, email, etc.
 *
 * @param req Express request object
 * @param res Express response object
 */
const filterUserController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Get a user from their ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const getUserController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Get all friend requests for a user
 *
 * @param req Express request object
 * @param res Express response object
 */
const getFriendRequestController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Send a friend request to the specified user as the currently authenticated user
 *
 * @param req Express request object
 * @param res Express response object
 */
const sendFriendRequestController = (req: Request, res: Response) => {
  // TODO: Implement
}; // POST

/**
 * Get all friends for a user
 *
 * @param req Express request object
 * @param res Express response object
 */
const getUserFriendsController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

export {
  filterUserController,
  getUserController,
  getFriendRequestController,
  sendFriendRequestController,
  getUserFriendsController
};
