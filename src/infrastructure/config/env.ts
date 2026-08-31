import "dotenv/config";

const httpPort = process.env.HTTP_PORT
if (!httpPort) {
  throw new Error("PORT environment variable is required");
}

const salt = process.env.BCRYPT_SALT
if (!salt) {
  throw new Error("BCRYPT_SALT environment variable is required");
}
const bcryptSalt = parseInt(salt)

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const env = {
  httpPort,
  bcryptSalt,
  jwtSecret
}