import type { SendMessageInputDto, SendMessageOutputDto } from "@application/dtos/send-message.dto.js";
import type { IdGenerator } from "@application/protocols/id-generator.js";
import type { UseCase } from "@application/protocols/use-case.js";
import type { MessageRepository } from "@application/repositories/message.repository.js";
import type { UserRepository } from "@application/repositories/user.repository.js";
import { Message } from "@domain/entities/message.entity.js";
import { NotFoundError } from "@shared/errors/app-error.js";

export class SendMessageUseCase implements UseCase<SendMessageInputDto, SendMessageOutputDto> {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly userRepo: UserRepository,
    private readonly idGenerator: IdGenerator
  ) {}

  async execute(input: SendMessageInputDto): Promise<SendMessageOutputDto> {
    const message = new Message(
      this.idGenerator.generate(),
      input.idChat,
      input.idSender,
      input.content,
      new Date()
    )

    await this.messageRepo.save(message)

    const sender = await this.userRepo.findById(message.getIdSender())

    if (!sender) {
      throw new NotFoundError(`User with id ${message.getIdSender()} not found`)
    }
    
    return { 
      message: {
        id: message.getId(),
        idChat: message.getIdChat(),
        sender: {
          id: sender.getId(),
          name: sender.getName(),
          online: true
        },
        content: message.getContent(),
        date: message.getDate()
      }
    }
  }
}