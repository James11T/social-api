import type { Request, Response } from "express";

/**
 * Filter comments by search query
 */
const queryCommentController = async (req: Request, res: Response) => {};

/**
 * Create a comment from the request body
 */
const createCommentController = async (req: Request, res: Response) => {};

/**
 * Get a comment by ID
 */
const getCommentController = async (req: Request, res: Response) => {};

/**
 * Delete a comment by ID
 */
const deleteCommentController = async (req: Request, res: Response) => {};

/**
 * Update a comment by ID
 */
const editCommentController = async (req: Request, res: Response) => {};

export {
  queryCommentController,
  createCommentController,
  getCommentController,
  deleteCommentController,
  editCommentController,
};
