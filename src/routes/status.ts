import { Router } from "express";
import { pingController } from "../controllers/status";

const testRouter = Router();

testRouter.get("/ping", pingController);

export default testRouter;
