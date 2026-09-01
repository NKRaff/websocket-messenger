import type { Message } from "@domain/entities/message.entity.js";

export interface MessageRepository {
  save(message: Message): Promise<void>
  findAllByChat(idChat: string): Promise<Message[]>
}