import type { StartChatInputDto, StartChatOutputDto } from "@application/dtos/start-chat.dto.js";
import type { IdGenerator } from "@application/protocols/id-generator.js";
import type { UseCase } from "@application/protocols/use-case.js";
import type { ChatRepository } from "@application/repositories/chat.reposiry.js";
import type { UserRepository } from "@application/repositories/user.repository.js";
import { Chat } from "@domain/entities/chat.entity.js";
import { NotFoundError, UnprocessableEntityError } from "@shared/errors/app-error.js";

export class StartChatUseCase implements UseCase<StartChatInputDto, StartChatOutputDto> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly chatRepo: ChatRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: StartChatInputDto): Promise<StartChatOutputDto> {
    const seeker = await this.userRepo.findById(input.seekerId)
    const sought = await this.userRepo.findByName(input.soughtName)

    if (!seeker) {
      throw new NotFoundError(`User with id ${input.seekerId} not found`)
    }

    if (!sought) {
      throw new NotFoundError(`User with name ${input.soughtName} not found`)
    }

    if (seeker.getId() === sought.getId()) {
      throw new UnprocessableEntityError(`User cannot create a chat with themselves.`)
    }

    const chatExisting = await this.chatRepo.existsBetween(input.seekerId, sought.getId())

    if (chatExisting) {
      return {
        message: "Chat successfully created",
        conversation: {
          id: chatExisting.getId(),
          type: chatExisting.getType(),
          users: chatExisting.getParticipants().map((user) => {
            return {
              id: user.getId(),
              name: user.getName(),
              online: true
            }
          }),
          messages: chatExisting.getMessage().map((message) => {
            return {
              id: message.getId(),
              idSender: message.getIdSender(),
              content: message.getContent(),
              date: message.getDate()
            }
          })
        }
      }
    }

    const chat = new Chat(
      this.idGenerator.generate(), 
      'private', 
      [seeker, sought], 
      []
    )

    await this.chatRepo.create(chat)

    return {
      message: "Chat successfully created",
      conversation: {
        id: chat.getId(),
        type: chat.getType(),
        users: chat.getParticipants().map((user) => {
          return {
            id: user.getId(),
            name: user.getName(),
            online: true
          }
        }),
        messages: []
      }
    }
  }
}