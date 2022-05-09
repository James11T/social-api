import type { Request, Response } from "express";

/**
 * Authenticate a user with their email and password
 *
 * @param req Express request object
 * @param res Express response object
 */
const signInController = (req: Request, res: Response) => {
  // TODO: Implement
}; // POST

/**
 * Create a new user from the request body
 *
 * @param req Express request object
 * @param res Express response object
 */
const signUpController = (req: Request, res: Response) => {
  // TODO: Implement
}; // POST

/**
 * Clear the authentication cookie
 *
 * @param req Express request object
 * @param res Express response object
 */
const deauthController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

/**
 * Trigger a password reset
 *
 * @param req Express request object
 * @param res Express response object
 */
const forgotPasswordController = (req: Request, res: Response) => {
  // TODO: Implement
}; // GET

export {
  signInController,
  signUpController,
  deauthController,
  forgotPasswordController
};
