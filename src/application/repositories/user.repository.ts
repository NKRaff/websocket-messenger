import type { User } from "@domain/entities/user.entity.js"

export interface UserRepository {
  save(user: User): Promise<void>
  findByName(name: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}