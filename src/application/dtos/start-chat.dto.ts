
export type StartChatInputDto = {
  seekerId: string,
  soughtName: string
}

export type StartChatOutputDto = {
  message: string,
  conversation: {
    id: string,
    user: {
      id: string,
      name: string,
      online: boolean
    },
    messages: {
      id: string,
      senderId: string,
      content: string,
      date: Date
    }[]
  }
}