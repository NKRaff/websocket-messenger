import { AppError } from '@shared/errors/app-error.js'
import {
  type NextFunction,
  type Request,
  type Response
} from 'express'
import { ZodError } from 'zod'

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (isJsonParseError(error)) {
    return res.status(400).json({
      message: 'Invalid JSON'
    })
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    })
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message
    })
  }

  console.error(error)

  return res.status(500).json({
    message: 'Internal server error'
  })
}

function isJsonParseError(
  error: unknown
): error is { type: string; statusCode: number } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    (error as { type: unknown }).type === 'entity.parse.failed'
  )
}