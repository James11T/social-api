import { Router } from "express";
import {
  queryLikeController,
  deleteLikeController,
  createLikeController,
  countLikeController,
} from "../controllers/like.controller";

const likeRouter = Router();

likeRouter.get("/", queryLikeController);
likeRouter.delete("/", deleteLikeController);
likeRouter.post("/", createLikeController);
likeRouter.delete("/count", countLikeController);

export default likeRouter;
