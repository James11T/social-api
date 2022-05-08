import { Router } from "express";
import {
  getCommentController,
  deleteCommentController,
  editCommentController
} from "../controllers/comments.controller";

const commentsRouter = Router();

commentsRouter.get("/:commentId", getCommentController);
commentsRouter.delete("/:commentId", deleteCommentController);
commentsRouter.patch("/:commentId", editCommentController);

export default commentsRouter;
