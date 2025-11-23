let { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define("assets", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("currency", "crypto", "gold"),
      allowNull: false,
    }
  }, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  })
}