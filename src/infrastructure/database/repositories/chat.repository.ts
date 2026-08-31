import type { ChatRepository } from "@application/repositories/chat.reposiry.js";
import { Chat } from "@domain/entities/chat.entity.js";
import { Message } from "@domain/entities/message.entity.js";
import { User } from "@domain/entities/user.entity.js";
import { NotFoundError } from "@shared/errors/app-error.js";
import { Op, Sequelize } from "sequelize";
import { ChatUserModel } from "../models/chat-user.model.js";
import { ChatModel } from "../models/chat.model.js";
import { MessageModel } from "../models/message.model.js";
import { UserModel } from "../models/user.model.js";

export class ChatRepositorySequelize implements ChatRepository {
  async create(chat: Chat): Promise<void> {
    await ChatModel.create({
      id: chat.getId(),
      type: chat.getType()
    })

    const participants = chat.getParticipants()
    participants.forEach(async user => {
      await ChatUserModel.create({
        idChat: chat.getId(),
        idUser: user.getId()
      })
    });
  }

  async existsBetween(seekerId: string, soughtId: string): Promise<Chat | null> {
    const chatsWithUsers = await ChatUserModel.findAll({
      attributes: ["idChat"],
      where: {
        idUser: {
          [Op.in]: [seekerId, soughtId],
        }
      },
      group: ["idChat"],
      having: Sequelize.literal('COUNT(DISTINCT "id_user") = 2')
    })

    if (chatsWithUsers.length === 0) {
      return null
    }

    chatsWithUsers.forEach(async chat => {
      const privateChat = await ChatModel.findOne({
        where: {
          id: chat.idChat,
          type: "private"
        }
      })

      if (privateChat) {
        const usersInChat = [seekerId, soughtId]
        const massagesModel = await MessageModel.findAll({
          where: {
            idChat: chat.idChat
          }
        })

        const users = await Promise.all(
          usersInChat.map(async (userId) => {
            const userModel = await UserModel.findByPk(userId)
            if(!userModel) {
              throw new NotFoundError(`User with id ${userId} not found`)
            }
            return new User(userModel.id, userModel.name, userModel.password)
          }),
        )

        return new Chat(
          privateChat.id,
          privateChat.type,
          users,
          massagesModel.map((message) => {
            return new Message(
              message.id, 
              message.idChat, 
              message.idSender, 
              message.content, 
              message.date
            )
          })
        )
      }
    })
    
    return null
  }
}