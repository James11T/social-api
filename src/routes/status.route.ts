import { Router } from "express";
import { pingController } from "../controllers/status.controller";

const statusRouter = Router();

statusRouter.get("/", pingController);

export default statusRouter;
