import { alwaysArray } from "../utils/array";
import { uploadFile } from "../aws/s3";
import { uniqueString } from "../utils/strings";
import { APIServerError } from "../errors/api";
import { WEB_CONSTANTS } from "../config";
import type { NextFunction, Request, Response } from "express";

const { WEB_DOMAIN } = process.env;

/**
 * Filter posts by search query
 *
 * @param req Express request object
 * @param res Express response object
 */
const queryPostsController = async (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Create a post from the request body
 *
 * @param req Express request object
 * @param res Express response object
 */
const createPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = alwaysArray(req.files.media);
  const postId = uniqueString();

  let uploads;
  try {
    uploads = await Promise.all(
      files.map(async (file, index) => {
        await uploadFile(file.data, `media/${postId}/media${index}`);
        return `https://${WEB_CONSTANTS.MEDIA_SUBDOMAIN}.${WEB_DOMAIN}/media/${postId}/media${index}`;
      })
    );
  } catch {
    return next(new APIServerError("Error uploading files"));
  }

  return res.json({
    media: uploads
  });
  // TODO: Current
  // TODO: Implement remaining data
}; // POST

/**
 * Get a post by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const getPostController = async (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Delete a post by ID
 *
 * @param req Express request object
 * @param res Express response object
 */
const deletePostController = async (req: Request, res: Response) => {
  // TODO: Implement
}; // DELETE

/**
 * Edit a post by ID based off the request body
 *
 * @param req Express request object
 * @param res Express response object
 */
const editPostController = async (req: Request, res: Response) => {
  // TODO: Implement
}; // PATCH

export {
  queryPostsController,
  createPostController,
  getPostController,
  deletePostController,
  editPostController
};
