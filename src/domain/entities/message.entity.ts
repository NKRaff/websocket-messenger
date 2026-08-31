export class Message {
  constructor(
    private id: string,
    private idChat: string,
    private idSender: string,
    private content: string,
    private date: Date
  ) {}

  getId(): string {
    return this.id
  }

  getIdChat(): string {
    return this.idChat
  }

  getIdSender(): string {
    return this.idSender
  }

  getContent(): string {
    return this.content
  }

  getDate(): Date {
    return this.date
  }
}