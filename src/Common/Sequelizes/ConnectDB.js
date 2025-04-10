import { Sequelize } from "sequelize";
import initModels from "../../models/init-models.js";
// import DATABASE_URL from "../constant/app.constant.js"


// console.log(DATABASE_URL)
const sequelize = new Sequelize('mysql://root:1234@localhost:3307/app_food')
export const models = initModels(sequelize)
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize;