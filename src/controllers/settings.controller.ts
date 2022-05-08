import type { Request, Response } from "express";

/**
 * Get all settings for the current user
 *
 * @param req Express request object
 * @param res Express response object
 */
const getSettingsController = (req: Request, res: Response) => {}; // GET

/**
 * Get a specific setting for the current user
 *
 * @param req Express request object
 * @param res Express response object
 */
const getSpecificSettingController = (req: Request, res: Response) => {}; // GET

/**
 * Set a specific setting for the current user
 *
 * @param req Express request object
 * @param res Express response object
 */
const setSettingController = (req: Request, res: Response) => {}; // PATCH

export {
  getSettingsController,
  getSpecificSettingController,
  setSettingController
};
