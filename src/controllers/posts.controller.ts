import { uuid } from "../utils/strings";
import { WEB_CONSTANTS } from "../config";
import { uploadFile } from "../services/s3";
import { alwaysArray } from "../utils/array";
import {
  APIBadRequestError,
  APIServerError,
  APIUnauthorizedError
} from "../errors/api";
import type { NextFunction, Request, Response } from "express";
import { Post, PostMedia } from "../models";
import AppDataSource from "../database";

const { WEB_DOMAIN, AWS_S3_IMAGE_BUCKET } = process.env;

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
  if (!req.user)
    return next(
      new APIUnauthorizedError("You must be authenticated to create posts")
    );
  if (!req.files) return next(new APIBadRequestError("No files submitted"));

  const files = alwaysArray(req.files.media);
  const postId = uuid();

  const uploads: string[] = [];

  const newPost = new Post();
  newPost.id = postId;
  newPost.author = req.user;
  newPost.caption = req.body.caption;
  newPost.postedAt = new Date();

  for (const [index, file] of files.entries()) {
    const uploadRes = await uploadFile(
      file.data,
      `media/${postId}/media${index}`,
      AWS_S3_IMAGE_BUCKET
    );
    if (uploadRes.err) {
      return next(new APIServerError("Error uploading files"));
    }

    uploads.push(
      `https://${WEB_CONSTANTS.MEDIA_SUBDOMAIN}.${WEB_DOMAIN}/media/${postId}/media${index}`
    );
  }

  const postMedia = uploads.map((mediaUrl, index) => {
    const newPostMedia = new PostMedia();
    newPostMedia.id = uuid();
    newPostMedia.url = mediaUrl;
    newPostMedia.type = "image";
    newPostMedia.index = index;
    newPostMedia.post = newPost;
    return newPostMedia;
  });

  try {
    await AppDataSource.transaction(async (transactionManager) => {
      await transactionManager.save(newPost);
      await transactionManager.save(postMedia);
    });
  } catch (err) {
    console.error(err);
    return next(new APIServerError("Failed to save post"));
  }

  return res.json({
    media: uploads,
    postId
  });
  // TODO: Current
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
