import { uuid } from "../utils/strings";
import { WEB_CONSTANTS } from "../config";
import { uploadFile } from "../services/s3";
import { alwaysArray } from "../utils/array";
import { APIBadRequestError, APIServerError } from "../errors/api";
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
const createPostController = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) return next(new APIBadRequestError("No files submitted"));

  const files = alwaysArray(req.files.media);
  const postId = uuid();

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

export { queryPostsController, createPostController, getPostController, deletePostController, editPostController };
