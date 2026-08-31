import type { UserRepository } from "@application/repositories/user.repository.js";
import { User } from "@domain/entities/user.entity.js";
import { UserModel } from "../models/user.model.js";

export class UserRepositorySerquelize implements UserRepository {
  async save(user: User): Promise<void> {
    await UserModel.create({
      id: user.getId(),
      name: user.getName(),
      password: user.getPassword()
    })
  }
  
  async findByName(name: string): Promise<User | null> {
    const model = await UserModel.findOne({
      where: {name}
    })
    
    if (model === null) {
      return null
    } else {
      return new User(model.id, model.name, model.password) || null
    }
  }

  async findById(id: string): Promise<User | null> {
    const model = await UserModel.findByPk(id)

    if (model === null) {
      return null
    } else {
      return new User(model.id, model.name, model.password)
    }
  }
  
}