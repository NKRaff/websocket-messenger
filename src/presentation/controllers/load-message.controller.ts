import type { LoadMessageInputDto, LoadMessageOutputDto } from "@application/dtos/load-message.dto.js";
import type { Controller } from "@application/protocols/controller.js";
import type { UseCase } from "@application/protocols/use-case.js";
import { LoadMessageSchema } from "@presentation/schemas/load-message.schema.js";

export class LoadMessageController implements Controller<LoadMessageOutputDto> {
  constructor(
    private readonly loadMessageUseCase: UseCase<LoadMessageInputDto, LoadMessageOutputDto>
  ) {}

  async handle(input: unknown): Promise<LoadMessageOutputDto> {
    const dto = LoadMessageSchema.parse(input)
    return await this.loadMessageUseCase.execute(dto)
  }
}