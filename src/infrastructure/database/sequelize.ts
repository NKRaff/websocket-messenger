import { Sequelize } from "sequelize";

export class SequelizeORM {
  sequelize: Sequelize
  
  constructor() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false
    })
    this.connectionTest()
    this.sync()
  }

  private async connectionTest() {
    try {
      await this.sequelize.authenticate();
      console.log('Successfully connected to the database.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  private async sync() {
    await this.sequelize.sync({ force: true })
  }

  getInstance() {
    return this.sequelize
  }
}

const sequelize = new SequelizeORM().getInstance()
export { sequelize };

