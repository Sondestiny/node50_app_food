import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Food_types from  "./Food_types.js";
import _Foods from  "./Foods.js";
import _Like_res from  "./Like_res.js";
import _Orders from  "./Orders.js";
import _Rate_res from  "./Rate_res.js";
import _Restaurants from  "./Restaurants.js";
import _Sub_foods from  "./Sub_foods.js";
import _Users from  "./Users.js";

export default function initModels(sequelize) {
  const Food_types = _Food_types.init(sequelize, DataTypes);
  const Foods = _Foods.init(sequelize, DataTypes);
  const Like_res = _Like_res.init(sequelize, DataTypes);
  const Orders = _Orders.init(sequelize, DataTypes);
  const Rate_res = _Rate_res.init(sequelize, DataTypes);
  const Restaurants = _Restaurants.init(sequelize, DataTypes);
  const Sub_foods = _Sub_foods.init(sequelize, DataTypes);
  const Users = _Users.init(sequelize, DataTypes);

  Foods.belongsTo(Food_types, { as: "type", foreignKey: "type_id"});
  Food_types.hasMany(Foods, { as: "Foods", foreignKey: "type_id"});
  Orders.belongsTo(Foods, { as: "food", foreignKey: "food_id"});
  Foods.hasMany(Orders, { as: "Orders", foreignKey: "food_id"});
  Sub_foods.belongsTo(Foods, { as: "food", foreignKey: "food_id"});
  Foods.hasMany(Sub_foods, { as: "Sub_foods", foreignKey: "food_id"});
  Like_res.belongsTo(Restaurants, { as: "re", foreignKey: "res_id"});
  Restaurants.hasMany(Like_res, { as: "Like_res", foreignKey: "res_id"});
  Rate_res.belongsTo(Restaurants, { as: "re", foreignKey: "res_id"});
  Restaurants.hasMany(Rate_res, { as: "Rate_res", foreignKey: "res_id"});
  Like_res.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Like_res, { as: "Like_res", foreignKey: "user_id"});
  Orders.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Orders, { as: "Orders", foreignKey: "user_id"});
  Rate_res.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Rate_res, { as: "Rate_res", foreignKey: "user_id"});

  return {
    Food_types,
    Foods,
    Like_res,
    Orders,
    Rate_res,
    Restaurants,
    Sub_foods,
    Users,
  };
}
