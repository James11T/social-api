import express, { NextFunction } from "express";
import { RUNTIME_CONSTANTS } from "../config";
import { getMemeoryUsage } from "../utils/process";

/**
 * Responds with pong if API is alive
 *
 * @param req Express request object
 * @param res Express response object
 */
const pingController = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  return res.json({
    status: "ONLINE",
    version: "1.0.0",
    country: req.country,
    memoryUsage: RUNTIME_CONSTANTS.IS_DEV ? getMemeoryUsage() : undefined
  });
};

export { pingController };
