import mime from "mime-types";
import { POST_CONSTANTS } from "../../config";
import { body, check } from "express-validator";
import { APIBadRequestError } from "../../errors/api";
import { alwaysArray, removeDuplicates } from "../../utils/array";
import validateRequest from "../../middleware/validation.middleware";
import type { Request, Response, NextFunction } from "express";

const validateCreatePost = [
  check("files")
    .custom((_, { req }) => req.files && req.files.media)
    .withMessage("At least 1 media file is required")
    .bail(),
  body("caption").isLength({ min: 1, max: 2048 }).withMessage("Post caption must be between 1 and 2048 characters"),
  validateRequest
];

const validateMedia = (req: Request, res: Response, next: NextFunction) => {
  const files = alwaysArray(req.files?.media);

  const truncated = files.some((file) => file.truncated);
  if (truncated) return next(new APIBadRequestError("One or more files exceeded the maximum size of 50MB"));

  const invalidTypes = removeDuplicates(
    files.filter((file) => !POST_CONSTANTS.ALLOWED_MEDIA_TYPES.includes(file.mimetype)).map((file) => file.mimetype)
  );

  if (invalidTypes.length > 0) {
    return next(
      new APIBadRequestError("The following types are not supported: " + invalidTypes.map(mime.extension).join(", "))
    );
  }

  next();
};

export { validateCreatePost, validateMedia };
