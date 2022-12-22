import { Router } from "express";
import {
  queryCommentController,
  getCommentController,
  createCommentController,
  deleteCommentController,
  editCommentController,
} from "../controllers/comments.controller";

const commentsRouter = Router();

commentsRouter.get("/", queryCommentController);
commentsRouter.post("/", createCommentController);
commentsRouter.get("/:commentId", getCommentController);
commentsRouter.delete("/:commentId", deleteCommentController);
commentsRouter.patch("/:commentId", editCommentController);

export default commentsRouter;
