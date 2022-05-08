import { Router } from "express";
import {
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
} from "../controllers/posts.controller";

const postsRouter = Router();

postsRouter.post("/", createPostController);

postsRouter.get("/:postId", getPostController);
postsRouter.delete("/:postId", deletePostController);
postsRouter.patch("/:postId", editPostController);

postsRouter.get("/:postId/comments", getPostComments);
postsRouter.post("/:postId/comments", createCommentController);

postsRouter.get("/:postId/like", isPostLikedController);
postsRouter.post("/:postId/like", likePostController);
postsRouter.delete("/:postId/like", unlikePostController);

postsRouter.post("/:postId/like/count", getLikeCountController);

postsRouter.get("/search/:searchTerm", searchPostsController);

export default postsRouter;
