import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Orders extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Foods',
        key: 'food_id'
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    arr_sub_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Orders',
    timestamps: false,
    indexes: [
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "food_id",
        using: "BTREE",
        fields: [
          { name: "food_id" },
        ]
      },
    ]
  });
  }
}
