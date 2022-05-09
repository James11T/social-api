import type { Request, Response } from "express";

/**
 * Find likes by search query
 *
 * Intended to be used to find likes on a post
 *
 * @param req Express request object
 * @param res Express response object
 */
const queryLikeController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Delete a like by post ID and potential user ID
 *
 * ?postId=1&userId=1
 *
 * @param req Express request object
 * @param res Express response object
 */
const deleteLikeController = (req: Request, res: Response) => {
  // TODO: Implement
}; // DELETE

/**
 * Create a like on a given post
 *
 * ?postId=1&userId=1
 *
 * @param req Express request object
 * @param res Express response object
 */
const createLikeController = (req: Request, res: Response) => {
  // TODO: Implement
}; // POST

/**
 * Count the number of likes on a given post
 *
 * ?postId=1
 *
 * @param req Express request object
 * @param res Express response object
 */
const countLikeController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

export {
  queryLikeController,
  deleteLikeController,
  createLikeController,
  countLikeController
};
