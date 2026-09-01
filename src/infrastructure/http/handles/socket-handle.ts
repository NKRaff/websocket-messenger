import type { SendMessageOutputDto } from "@application/dtos/send-message.dto.js";
import type { Controller } from "@application/protocols/controller.js";
import { Socket, type Server } from "socket.io";

export class SocketHandle {
  constructor(
    private io: Server,
    private readonly sendMessageController: Controller<SendMessageOutputDto>
  ){}

  listen() {
    this.io.on("connection", (socket: Socket) => {
      const userId = socket.data.userId
      
      socket.join(userId)
    
      socket.on("send_message", async (data) => {
        try {
          const { recipientId, message, chatId } = data
          const savedMessage = await this.sendMessageController.handle({
            idChat: chatId,
            idSender: userId,
            content: message
          })
          this.io
            .to(recipientId)
            .to(userId)
            .emit("message", {
              id: savedMessage.message.id,
              chatId: savedMessage.message.idChat,
              sender: {
                id: savedMessage.message.sender.id,
                name: savedMessage.message.sender.name,
                online: savedMessage.message.sender.online
              },
              message: savedMessage.message.content,
              date: savedMessage.message.date
            })
        } catch (error) {
          console.error(`Erro ao enviar mensagem: ${error}`)
          //throw new Error(`Erro ao enviar mensagem: ${error}`)
        }
      })
    })
  }

}