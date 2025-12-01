let { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define("populars", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    asset_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  })
}