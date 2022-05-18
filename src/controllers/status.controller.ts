import express, { NextFunction } from "express";

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
  return res.json({ status: "ONLINE", version: "1.0.0" });
};

export { pingController };
