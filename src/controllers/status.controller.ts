import express from "express";
import type { pingSchemaType } from "../validation/status.validation";

/**
 * Responds with pong if API is alive
 *
 * @param req Express request object
 * @param res Express response object
 */
const pingController = async (
  req: express.Request<unknown, unknown, unknown, pingSchemaType>,
  res: express.Response
) => {
  res.json({ message: "Hello World!" });
};

export { pingController };
