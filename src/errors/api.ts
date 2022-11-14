import { RUNTIME_CONSTANTS } from "../config";

class APIBaseError extends Error {
  status: number;

  constructor(msg: string, status = 500) {
    super(msg);

    this.status = status;
  }

  toJSON(): any {
    return {
      error: this.message,
      stack: RUNTIME_CONSTANTS.IS_DEV && this.stack ? this.stack.split("\n").map((line) => line.trim()) : undefined
    };
  }
}

class APIBadRequestError extends APIBaseError {
  constructor(msg = "Bad Request") {
    super(msg, 400);
  }
}

class APIUnauthorizedError extends APIBaseError {
  constructor(msg = "Unauthorized") {
    super(msg, 401);
  }
}

class APIForbiddenError extends APIBaseError {
  constructor(msg = "Access Denied") {
    super(msg, 403);
  }
}

class APINotFoundError extends APIBaseError {
  constructor(msg = "Not Found") {
    super(msg, 404);
  }
}

class APIConflictError extends APIBaseError {
  constructor(msg = "Conflict") {
    super(msg, 409);
  }
}

class APIServerError extends APIBaseError {
  constructor(msg = "Internal Server Error") {
    super(msg, 500);
  }
}

export type BadParams = Record<string, { location: string; message: string }>;

class APIParameterError extends APIBadRequestError {
  parameters: BadParams;

  constructor(msg = "One or more supplied parameters are invalid", parameters: BadParams) {
    super(msg);

    this.parameters = parameters;
  }

  toJSON(): any {
    return { ...super.toJSON(), parameters: this.parameters };
  }
}

export {
  APIBaseError,
  APIBadRequestError,
  APIUnauthorizedError,
  APIForbiddenError,
  APINotFoundError,
  APIConflictError,
  APIServerError,
  APIParameterError
};
