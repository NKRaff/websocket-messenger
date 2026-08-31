import type { PasswordHasher } from "@application/protocols/password-hasher.js";
import { env } from "@infrastructure/config/env.js";
import { compare, hash } from "bcrypt";

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(data: string): Promise<string> {
    return await hash(data, env.bcryptSalt)
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return await compare(data, encrypted)
  }
}