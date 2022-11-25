import type { Request, Response } from "express";

/**
 * Filter comments by search query
 *
 * @param req Express request object
 * @param res Express response object
 */
const queryCommentController = async (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Create a comment from the request body
 *
 * @param req Express request object
 * @param res Express response object
 */
const createCommentController = async (req: Request, res: Response) => {
  // TODO: Implement
}; // POST

/**
 * Get a comment by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const getCommentController = async (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Delete a comment by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const deleteCommentController = async (req: Request, res: Response) => {
  // TODO: Implement
}; // DELETE

/**
 * Update a comment by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const editCommentController = async (req: Request, res: Response) => {
  // TODO: Implement
}; // PATCH

export {
  queryCommentController,
  createCommentController,
  getCommentController,
  deleteCommentController,
  editCommentController,
};
