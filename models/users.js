let { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  return sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      allowNull: false,
      defaultValue: "USER"
    }
  }, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  })
}