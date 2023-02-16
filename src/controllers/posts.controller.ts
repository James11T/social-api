import * as APIErrors from "../errors/api";
import { uuid } from "../utils/strings";
import AppDataSource from "../database";
import { WEB_CONSTANTS } from "../config";
import { uploadFile } from "../services/s3";
import { alwaysArray } from "../utils/array";
import { Post, PostMedia } from "../models";
import type * as postRequestSchemas from "../validation/posts.validation";
import type { NextFunction, Request, Response } from "express";
import type { ValidatedRequest } from "../middleware/validation.middleware";

const { WEB_DOMAIN, AWS_S3_IMAGE_BUCKET } = process.env;

/**
 * Filter posts by search query
 */
const queryPostsController = async (req: Request, res: Response) => {
  return res.status(501).send("Feature not yet available");
};

/**
 * Create a post from the request body
 */
const createPostController = async (
  req: ValidatedRequest<typeof postRequestSchemas.createPostSchema>,
  res: Response,
  next: NextFunction
) => {
  if (!req.user)
    return next(new APIErrors.APIUnauthorizedError("You must be authenticated to create posts"));
  if (!req.files) return next(new APIErrors.APIBadRequestError("No files submitted"));

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
      return next(new APIErrors.APIServerError("Error uploading files"));
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
    return next(new APIErrors.APIServerError("Failed to save post"));
  }

  return res.json({
    media: uploads,
    postId,
  });
};

/**
 * Get a post by ID
 */
const getPostController = async (
  req: ValidatedRequest<typeof postRequestSchemas.getPostSchema>,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;

  let post: Post | null = null;
  try {
    post = await Post.findOne({ where: { id: postId } });
  } catch (err) {
    console.error(err);
    return next(new APIErrors.APIServerError("Failed to fetch post"));
  }

  if (!post) return next(new APIErrors.APINotFoundError("Post not found"));

  return res.json(post);
};

/**
 * Delete a post by ID
 */
const deletePostController = async (
  req: ValidatedRequest<typeof postRequestSchemas.getPostSchema>,
  res: Response,
  next: NextFunction
) => {};

/**
 * Edit a post by ID based off the request body
 */
const editPostController = async (req: Request, res: Response) => {};

export {
  queryPostsController,
  createPostController,
  getPostController,
  deletePostController,
  editPostController,
};
