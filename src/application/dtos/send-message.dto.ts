export type SendMessageInputDto = {
  idChat: string,
  idSender: string,
  content: string,
}

export type SendMessageOutputDto = {
  message: {
    id: string,
    idChat: string,
    sender: {
      id: string,
      name: string,
      online: boolean
    },
    content: string,
    date: Date
  },
}