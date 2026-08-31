import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize.js";

export class MessageModel extends Model {
  declare id: string
  declare idChat: string
  declare idSender: string
  declare content: string
  declare date: Date
}

MessageModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    idChat: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "id_chat"
    },
    idSender: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "id_sender"
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: "messages",
    timestamps: false
  }
)