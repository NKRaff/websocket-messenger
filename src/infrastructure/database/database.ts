import "./models/index.js";
import { sequelize } from "./sequelize.js";

export async function initializeDatabase() {
  try {
    await sequelize.authenticate()
    console.log("Successfully connected to the database.");
    
    await sequelize.sync({ force: true })
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
}