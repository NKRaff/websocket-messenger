export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// 400
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400)
    this.name = 'BadRequestError'
  }
}

// 401
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

// 403
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403)
    this.name = 'ForbiddenError'
  }
}

// 404
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

// 409
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409)
    this.name = 'ConflictError'
  }
}

// 422
export class UnprocessableEntityError extends AppError {
  constructor(message = 'Unprocessable entity') {
    super(message, 422)
    this.name = 'UnprocessableEntityError'
  }
}

// 429
export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429)
    this.name = 'TooManyRequestsError'
  }
}

// 500
export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500)
    this.name = 'InternalServerError'
  }
}

// 502
export class BadGatewayError extends AppError {
  constructor(message = 'Bad gateway') {
    super(message, 502)
    this.name = 'BadGatewayError'
  }
}

// 503
export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable') {
    super(message, 503)
    this.name = 'ServiceUnavailableError'
  }
}
