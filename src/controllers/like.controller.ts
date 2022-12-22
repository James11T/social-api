import type { Request, Response } from "express";

/**
 * Find likes by search query
 *
 * Intended to be used to find likes on a post
 */
const queryLikeController = async (req: Request, res: Response) => {};

/**
 * Delete a like by post ID and potential user ID
 */
const deleteLikeController = async (req: Request, res: Response) => {};

/**
 * Create a like on a given post
 */
const createLikeController = async (req: Request, res: Response) => {};

/**
 * Count the number of likes on a given post
 */
const countLikeController = async (req: Request, res: Response) => {};

export { queryLikeController, deleteLikeController, createLikeController, countLikeController };
