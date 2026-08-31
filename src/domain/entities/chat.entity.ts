import type { ChatType } from "@shared/types/chat-type.js";
import type { Message } from "./message.entity.js";
import type { User } from "./user.entity.js";

export class Chat {
  constructor(
    private id: string,
    private type: ChatType,
    private participants: User[],
    private messages: Message[]
  ) {}

  getId(): string {
    return this.id
  }

  getType(): ChatType {
    return this.type
  }

  getParticipants(): User[] {
    return this.participants
  }

  getMessage(): Message[] {
    return this.messages
  }
}