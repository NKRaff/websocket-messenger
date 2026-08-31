import type { TokenProvider } from "@application/protocols/token-provider.js";
import { env } from "@infrastructure/config/env.js";
import type { TokenPayload } from "@shared/types/token-payload.js";
import jwt from "jsonwebtoken";

export class JwtTokenProvider implements TokenProvider {
  generate(payload: TokenProvider): string {
    return jwt.sign(payload, env.jwtSecret, {expiresIn: "1h"})
  }

  verify(token: string): TokenPayload {
    return jwt.verify(token, env.jwtSecret) as TokenPayload
  }
}