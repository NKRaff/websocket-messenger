export type LoadMessageInputDto = {
  userId: string
}

export type LoadMessageOutputDto = {
  chat: {
    id: string,
    type: string,
    users: {
      id: string,
      name: string,
      online: boolean
    }[],
    messages: {
      id: string,
      idSender: string,
      content: string,
      date: Date
    }[]
  }[]
}