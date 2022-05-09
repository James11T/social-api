import { Router } from "express";
import {
  queryPostsController,
  createPostController,
  getPostController,
  deletePostController,
  editPostController
} from "../controllers/posts.controller";

const postsRouter = Router();

postsRouter.get("/", queryPostsController);
postsRouter.post("/", createPostController);

postsRouter.get("/:postId", getPostController);
postsRouter.delete("/:postId", deletePostController);
postsRouter.patch("/:postId", editPostController);

export default postsRouter;
