import type { LoadMessageInputDto, LoadMessageOutputDto } from "@application/dtos/load-message.dto.js";
import type { UseCase } from "@application/protocols/use-case.js";
import type { ChatRepository } from "@application/repositories/chat.reposiry.js";
import type { MessageRepository } from "@application/repositories/message.repository.js";
import { NotFoundError } from "@shared/errors/app-error.js";

export class LoadMessageUseCase implements UseCase<LoadMessageInputDto, LoadMessageOutputDto> {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly messageRepo: MessageRepository
  ) {}

  async execute(input: LoadMessageInputDto): Promise<LoadMessageOutputDto> {
    const userChats = await this.chatRepo.findByUser(input.userId)

    if (!userChats) {
      throw new NotFoundError(`User id ${input.userId} chats not found`)
    }

    const messagesList = await Promise.all(
      userChats.map(async (chat) => {
        const messageList = await this.messageRepo.findAllByChat(chat.getId())
        return {
          id: chat.getId(),
          type: chat.getType(),
          users: chat.getParticipants().map((user) => {
            return {
              id: user.getId(),
              name: user.getName(),
              online: true
            }
          }),
          messages: messageList.map((message) => {
            return {
              id: message.getId(),
              idSender: message.getIdSender(),
              content: message.getContent(),
              date: message.getDate()
            }
          })
        }
      })
    ) 

    return {
      chat: messagesList
    }
  }
}