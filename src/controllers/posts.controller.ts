import type { Request, Response } from "express";

/**
 * Filter posts by search query
 *
 * @param req Express request object
 * @param res Express response object
 */
const queryPostsController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Create a post from the request body
 *
 * @param req Express request object
 * @param res Express response object
 */
const createPostController = (req: Request, res: Response) => {
  // TODO: Implement
}; // POST

/**
 * Get a post by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const getPostController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Delete a post by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const deletePostController = (req: Request, res: Response) => {
  // TODO: Implement
}; // DELETE

/**
 * Edit a post by ID based off the request body
 *
 * @param req Express request object
 * @param res Express response object
 */
const editPostController = (req: Request, res: Response) => {
  // TODO: Implement
}; // PATCH

export {
  queryPostsController,
  createPostController,
  getPostController,
  deletePostController,
  editPostController
};
