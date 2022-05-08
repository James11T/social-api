import type { Request, Response } from "express";

/**
 * Get a comment by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const getCommentController = (req: Request, res: Response) => {}; // GET

/**
 * Delete a comment by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const deleteCommentController = (req: Request, res: Response) => {}; // DELETE

/**
 * Update a comment by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const editCommentController = (req: Request, res: Response) => {}; // PATCH

export { getCommentController, deleteCommentController, editCommentController };
