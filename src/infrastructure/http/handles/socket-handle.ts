import { Socket, type Server } from "socket.io";

export class SocketHandle {
  constructor(private io: Server){}

  listen() {
    this.io.on("connection", (socket: Socket) => {
      const userId = socket.data.userId
      
      socket.join(userId)
    
      socket.on("send_message", (data) => {
        const { recipientId, message } = data
        this.io.to(recipientId).emit("message", {
          senderId: userId,
          message,
          data: new Date()
        })
      })
    })
  }

}