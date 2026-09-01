import type { SendMessageInputDto, SendMessageOutputDto } from "@application/dtos/send-message.dto.js";
import type { Controller } from "@application/protocols/controller.js";
import type { UseCase } from "@application/protocols/use-case.js";
import { SendMessageSchema } from "@presentation/schemas/send-message.schema.js";

export class SendMessageController implements Controller<SendMessageOutputDto> {
  constructor(
    private readonly sendMessageUseCase: UseCase<SendMessageInputDto, SendMessageOutputDto>
  ) {}

  async handle(input: unknown): Promise<SendMessageOutputDto> {
    const dto = SendMessageSchema.parse(input)
    return await this.sendMessageUseCase.execute(dto)
  }
}