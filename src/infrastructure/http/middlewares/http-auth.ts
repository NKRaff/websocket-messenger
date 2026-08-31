import { JwtTokenProvider } from "@infrastructure/security/jwt-token-provider.js";
import { UnauthorizedError } from "@shared/errors/app-error.js";
import type { NextFunction, Request, Response } from "express";

const tokenProvider = new JwtTokenProvider()

export async function httpAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.access_token
    if (!token) {
      return next(new UnauthorizedError("User is not authenticated"))
    }

    const payload = tokenProvider.verify(token)

    req.user = {
      id: payload.sub
    }

    next()
  } catch (error) {
    return next(new UnauthorizedError("User is not authenticated"))
  }
}