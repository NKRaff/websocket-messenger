import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize.js";

export class ChatUserModel extends Model {
  declare idChat: string
  declare idUser: string
}

ChatUserModel.init(
  {
    idChat: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: "id_chat"
    },
    idUser: {
      type: DataTypes.STRING,
      primaryKey: true,
      field: "id_user"
    }
  }, {
    sequelize,
    tableName: "chat_user",
    timestamps: false
  }
)