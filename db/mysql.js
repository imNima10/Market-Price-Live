let { Sequelize } = require("sequelize")

let db = new Sequelize({
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false
})

/** @type {import("sequelize").ModelCtor<import("sequelize").Model<any, any>>} */
let Assets = require("../models/assets")(db)

/** @type {import("sequelize").ModelCtor<import("sequelize").Model<any, any>>} */
let Users = require("../models/users")(db)

/** @type {import("sequelize").ModelCtor<import("sequelize").Model<any, any>>} */
let Favorites = require("../models/favorites")(db)

/** @type {import("sequelize").ModelCtor<import("sequelize").Model<any, any>>} */
let Populars = require("../models/populars")(db)

Assets.belongsToMany(Users, {
    through: Favorites,
    foreignKey: "asset_id",
    otherKey: "user_id"
});

Users.belongsToMany(Assets, {
    through: Favorites,
    foreignKey: "user_id",
    otherKey: "asset_id"
});

Assets.hasMany(Populars, {
  foreignKey: "asset_id",
  as: "populars"
})

Populars.belongsTo(Assets, {
  foreignKey: "asset_id",
  as: "asset"
})

module.exports = {
    db,
    Assets,
    Users,
    Favorites,
    Populars
}