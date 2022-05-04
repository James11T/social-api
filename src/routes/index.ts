import { Router } from "express";
import testRouter from "./status";

const baseRouter = Router();

baseRouter.use("/status", testRouter);

export default baseRouter;
