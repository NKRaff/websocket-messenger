import { ChatUserModel } from "./chat-user.model.js"
import { ChatModel } from "./chat.model.js"
import { MessageModel } from "./message.model.js"
import { UserModel } from "./user.model.js"

// User -> Message
UserModel.hasMany(MessageModel, {
  foreignKey: "idSender"
})

MessageModel.belongsTo(UserModel, {
  foreignKey: "idSender"
})

// Chat -> Message
ChatModel.hasMany(MessageModel, {
  foreignKey: "idChat"
})

MessageModel.belongsTo(ChatModel, {
  foreignKey: "idChat"
})

// User <-> Chat
UserModel.belongsToMany(ChatModel, {
  through: ChatUserModel,
  foreignKey: "idUser",
  otherKey: "idChat"
})

ChatModel.belongsToMany(UserModel, {
  through: ChatUserModel,
  foreignKey: "idChat",
  otherKey: "idUser"
})

