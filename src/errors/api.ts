import { RUNTIME_CONSTANTS } from "../config";

class APIBaseError extends Error {
  status: number;

  constructor(msg: string, status: number = 500) {
    super(msg);

    this.status = status;
  }

  toJSON() {
    return {
      error: this.message,
      stack: RUNTIME_CONSTANTS.IS_DEV ? this.stack : undefined
    };
  }
}

class APIBadRequestError extends APIBaseError {
  constructor(msg: string = "Bad Request") {
    super(msg, 400);
  }
}

class APIUnauthorizedError extends APIBaseError {
  constructor(msg: string = "Unauthorized") {
    super(msg, 401);
  }
}

class APIForbiddenError extends APIBaseError {
  constructor(msg: string = "Access Denied") {
    super(msg, 403);
  }
}

class APINotFoundError extends APIBaseError {
  constructor(msg: string = "Not Found") {
    super(msg, 404);
  }
}

class APIConflictError extends APIBaseError {
  constructor(msg: string = "Conflict") {
    super(msg, 409);
  }
}

class APIServerError extends APIBaseError {
  constructor(msg: string = "Internal Server Error") {
    super(msg, 500);
  }
}

export interface BadParams {
  [name: string]: {
    location: string;
    message: string;
  };
}

class APIParameterError extends APIBadRequestError {
  parameters: BadParams;

  constructor(
    msg: string = "One or more supplied parameters are invalid",
    parameters: BadParams
  ) {
    super(msg);

    this.parameters = parameters;
  }

  toJSON() {
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
