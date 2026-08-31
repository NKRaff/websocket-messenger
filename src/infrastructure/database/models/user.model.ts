import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize.js";

export class UserModel extends Model {
  declare id: string
  declare name: string
  declare password: string
}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false
  }
)