import { Router } from "express";
import statusRouter from "./status.route";
import authRouter from "./auth.route";
import commentsRouter from "./comments.route";
import likesRouter from "./likes.route";
import postsRouter from "./posts.route";
import settingsRouter from "./settings.route";
import usersRouter from "./users.route";

const baseRouter = Router();

baseRouter.use("/status", statusRouter);
baseRouter.use("/auth", authRouter);
baseRouter.use("/comments", commentsRouter);
baseRouter.use("/likes", likesRouter);
baseRouter.use("/posts", postsRouter);
baseRouter.use("/settings", settingsRouter);
baseRouter.use("/users", usersRouter);

export default baseRouter;
