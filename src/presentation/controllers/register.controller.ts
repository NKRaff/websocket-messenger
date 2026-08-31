import type { RegisterInputDto, RegisterOutputDto } from "@application/dtos/register.dto.js"
import type { Controller } from "@application/protocols/controller.js"
import type { UseCase } from "@application/protocols/use-case.js"
import { RegisterSchema } from "@presentation/schemas/register.schema.js"

export class RegisterController implements Controller<RegisterOutputDto> {
  constructor(private readonly useCase: UseCase<RegisterInputDto, RegisterOutputDto>) {}

  async handle(input: unknown): Promise<RegisterOutputDto> {
    const dto = RegisterSchema.parse(input)
    return await this.useCase.execute(dto) 
  }
}