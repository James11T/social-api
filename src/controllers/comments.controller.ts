import type { Request, Response } from "express";

/**
 * Filter comments by search query
 *
 * @param req Express request object
 * @param res Express response object
 */
const queryCommentController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Create a comment from the request body
 *
 * @param req Express request object
 * @param res Express response object
 */
const createCommentController = (req: Request, res: Response) => {
  // TODO: Implement
}; // POST

/**
 * Get a comment by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const getCommentController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Delete a comment by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const deleteCommentController = (req: Request, res: Response) => {
  // TODO: Implement
}; // DELETE

/**
 * Update a comment by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const editCommentController = (req: Request, res: Response) => {
  // TODO: Implement
}; // PATCH

export {
  queryCommentController,
  createCommentController,
  getCommentController,
  deleteCommentController,
  editCommentController
};
