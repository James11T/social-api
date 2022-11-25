import { RUNTIME_CONSTANTS } from "../config";
import { getMemoryUsage } from "../utils/process";
import type { Request, Response, NextFunction } from "express";

/**
 * Responds with pong if API is alive
 *
 * @param req Express request object
 * @param res Express response object
 */
const pingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.json({
    status: "ONLINE",
    version: process.env.npm_package_version ?? "UNKNOWN",
    country: req.country,
    memoryUsage: RUNTIME_CONSTANTS.IS_DEV ? getMemoryUsage() : undefined,
  });
};

export { pingController };
