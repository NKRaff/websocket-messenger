import type { ChatType } from "@shared/types/chat-type.js"
import { DataTypes, Model } from "sequelize"
import { sequelize } from "../sequelize.js"

export class ChatModel extends Model {
  declare id: string
  declare type: ChatType
}

ChatModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: "chats",
    timestamps: false
  }
)