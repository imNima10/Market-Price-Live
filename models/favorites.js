const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("favorites", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    asset_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
}