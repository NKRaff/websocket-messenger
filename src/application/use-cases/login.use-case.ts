import type { LoginInputDto, LoginOutputDto } from "@application/dtos/login.dto.js"
import type { PasswordHasher } from "@application/protocols/password-hasher.js"
import type { TokenProvider } from "@application/protocols/token-provider.js"
import type { UseCase } from "@application/protocols/use-case.js"
import type { UserRepository } from "@application/repositories/user.repository.js"
import { BadRequestError, NotFoundError } from "@shared/errors/app-error.js"

export class LoginUseCase implements UseCase<LoginInputDto, LoginOutputDto> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenProvider: TokenProvider
  ) {}

  async execute(input: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.userRepo.findByName(input.name)

    if (user === null) {
      throw new NotFoundError(`Name or password is invalid`)
    }

    const isMatch = await this.passwordHasher.compare(input.password, user.getPassword())

    if (!isMatch) {
      throw new BadRequestError(`Name or password is invalid`)
    }

    const token = this.tokenProvider.generate({sub: user.getId()})

    return {
      message: 'User successfully logged in',
      token
    }
  }
}