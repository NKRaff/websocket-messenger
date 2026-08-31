import { JwtTokenProvider } from "@infrastructure/security/jwt-token-provider.js";
import { UnauthorizedError } from "@shared/errors/app-error.js";
import { parse } from "cookie";
import type { Socket } from "socket.io";

const tokenProvider = new JwtTokenProvider()

export async function socketAuth(socket: Socket, next: (err?: Error) => void) {
  try {
    const rawCookie = socket.handshake.headers.cookie
    
    if (!rawCookie) {
      return next(new UnauthorizedError("User is not authenticated"))
    }

    const cookies = parse(rawCookie)
    const token = cookies.access_token

    if (!token) {
      return next(new UnauthorizedError("User is not authenticated"))
    }

    const decoded = tokenProvider.verify(token)
    socket.data.userId = decoded.sub

    next()
  } catch (error) {
    next(new UnauthorizedError("User is not authenticated"))
  }
}