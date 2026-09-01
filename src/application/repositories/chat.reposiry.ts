import type { Chat } from "@domain/entities/chat.entity.js";

export interface ChatRepository {
  existsBetween(seekerId: string, soughtId: string): Promise<Chat | null>
  create(chat: Chat): Promise<void>
  findByUser(userId: string): Promise<Chat[] | null>
}