import type { MessageRepository } from "@application/repositories/message.repository.js";
import { Message } from "@domain/entities/message.entity.js";
import { MessageModel } from "../models/message.model.js";

export class MessageRepositorySequelize implements MessageRepository {
  async save(message: Message): Promise<void> {
    await MessageModel.create({
      id: message.getId(),
      idChat: message.getIdChat(),
      idSender: message.getIdSender(),
      content: message.getContent(),
      date: message.getDate()
    })
  }

  async findAllByChat(idChat: string): Promise<Message[]> {
    const messagesModel = await MessageModel.findAll({
      where: { idChat }
    })

    return messagesModel.map((message) => {
      return new Message(
        message.id,
        message.idChat,
        message.idSender,
        message.content,
        message.date
      )
    })
  }
}