import { Router } from "express";
import {
  queryPostsController,
  createPostController,
  getPostController,
  deletePostController,
  editPostController
} from "../controllers/posts.controller";
import fileUpload from "express-fileupload";
import { POST_CONSTANTS } from "../config";
import {
  validateMedia,
  validateCreatePost
} from "../validation/routes/posts.validation";
import { protect } from "../middleware/auth.middleware";

const postsRouter = Router();

postsRouter.get("/", queryPostsController);
postsRouter.post(
  "/",
  protect,
  fileUpload({
    limits: {
      files: POST_CONSTANTS.MAX_MEDIA_COUNT,
      fileSize: POST_CONSTANTS.MAX_MEDIA_SIZE
    }
  }),
  validateCreatePost,
  validateMedia,
  createPostController
);

postsRouter.get("/:postId", getPostController);
postsRouter.delete("/:postId", deletePostController);
postsRouter.patch("/:postId", editPostController);

export default postsRouter;
