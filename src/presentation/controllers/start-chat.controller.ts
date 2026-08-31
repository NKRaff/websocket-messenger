import type { StartChatInputDto, StartChatOutputDto } from "@application/dtos/start-chat.dto.js";
import type { Controller } from "@application/protocols/controller.js";
import type { UseCase } from "@application/protocols/use-case.js";
import { StartChatSchema } from "@presentation/schemas/start-chat.schema.js";

export class StartChatController implements Controller<StartChatOutputDto> {
  constructor(private readonly useCase: UseCase<StartChatInputDto, StartChatOutputDto>) {}

  async handle(input?: unknown): Promise<StartChatOutputDto> {
    const dto = StartChatSchema.parse(input)
    return await this.useCase.execute(dto)
  }
}