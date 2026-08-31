import type { LoginInputDto, LoginOutputDto } from "@application/dtos/login.dto.js"
import type { Controller } from "@application/protocols/controller.js"
import type { UseCase } from "@application/protocols/use-case.js"
import { LoginSchema } from "@presentation/schemas/login.schema.js"

export class LoginController implements Controller<LoginOutputDto> {
  constructor(
    private readonly loginUseCase: UseCase<LoginInputDto, LoginOutputDto>
  ) {}

  async handle(input?: unknown): Promise<LoginOutputDto> {
    const dto = LoginSchema.parse(input)
    return await this.loginUseCase.execute(dto)
  }
}