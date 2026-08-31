import type { RegisterInputDto, RegisterOutputDto } from "@application/dtos/register.dto.js"
import type { IdGenerator } from "@application/protocols/id-generator.js"
import type { PasswordHasher } from "@application/protocols/password-hasher.js"
import type { TokenProvider } from "@application/protocols/token-provider.js"
import type { UseCase } from "@application/protocols/use-case.js"
import type { UserRepository } from "@application/repositories/user.repository.js"
import { User } from "@domain/entities/user.entity.js"
import { ConflictError } from "@shared/errors/app-error.js"


export class RegisterUseCase implements UseCase<RegisterInputDto, RegisterOutputDto> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly idGenerator: IdGenerator,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenProvider: TokenProvider
  ) {}

  async execute(input: RegisterInputDto): Promise<RegisterOutputDto> {
    const existingUser = await this.userRepo.findByName(input.name)
    if (existingUser) {
      throw new ConflictError(`User with name ${input.name} already exists`)
    }

    const id = this.idGenerator.generate()

    const passwordHash = await this.passwordHasher.hash(input.password)

    const user = new User(id, input.name, passwordHash)

    this.userRepo.save(user)

    const token = this.tokenProvider.generate({sub: id})

    return { 
      message: "User register success",
      token
    }
  }
}