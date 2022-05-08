import type { Request, Response } from "express";

// POSTS

/**
 * Create a post from the request body
 *
 * @param req Express request object
 * @param res Express response object
 */
const createPostController = (req: Request, res: Response) => {}; // POST

/**
 * Get a post by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const getPostController = (req: Request, res: Response) => {}; // GET

/**
 * Delete a post by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const deletePostController = (req: Request, res: Response) => {}; // DELETE

/**
 * Edit a post by ID based off the request body
 *
 * @param req Express request object
 * @param res Express response object
 */
const editPostController = (req: Request, res: Response) => {}; // PATCH

// COMMENTS

/**
 * Get comments on a post by post ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const getPostComments = (req: Request, res: Response) => {}; // GET

/**
 * Create a comments on a post by post ID and reuqest body
 *
 * @param req Express request object
 * @param res Express response object
 */
const createCommentController = (req: Request, res: Response) => {}; // POST

// LIKES

/**
 * Check if a given post is liked by the current user
 *
 * @param req Express request object
 * @param res Express response object
 */
const isPostLikedController = (req: Request, res: Response) => {}; // GET

/**
 * Like a post as the current user based on the post ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const likePostController = (req: Request, res: Response) => {}; // POST

/**
 * Unlike a post as the current user based on the post ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const unlikePostController = (req: Request, res: Response) => {}; // DELETE

/**
 * Count how many likes there are on a given post by post ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const getLikeCountController = (req: Request, res: Response) => {}; // GET

// SEARCH

/**
 * Filter posts by search query
 *
 * @param req Express request object
 * @param res Express response object
 */
const searchPostsController = (req: Request, res: Response) => {}; // GET

export {
  createPostController,
  getPostController,
  deletePostController,
  editPostController,
  getPostComments,
  createCommentController,
  isPostLikedController,
  likePostController,
  unlikePostController,
  getLikeCountController,
  searchPostsController
};
