class CustomError extends Error {
  constructor(message, statusCode, name) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
  }
}

class BadRequestError extends CustomError {
  constructor(message) {
    super(message, 400, "BadRequest");
  }
}

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message, 401, "Unauthorized");
  }
}

class ForbiddenError extends CustomError {
  constructor(message) {
    super(message, 403, "Forbidden");
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 404, "NotFound");
  }
}

class ConflictError extends CustomError {
  constructor(message) {
    super(message, 409, "Conflict");
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
