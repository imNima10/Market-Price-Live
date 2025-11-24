'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addConstraint("favorites", {
        fields: ["user_id"],
        type: "foreign key",
        name: "fk_favorites_user_id",
        references: {
          table: "users",
          field: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        transaction
      });

      await queryInterface.addConstraint("favorites", {
        fields: ["asset_id"],
        type: "foreign key",
        name: "fk_favorites_asset_id",
        references: {
          table: "assets",
          field: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        transaction
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        "favorites",
        "fk_favorites_user_id",
        { transaction }
      );

      await queryInterface.removeConstraint(
        "favorites",
        "fk_favorites_asset_id",
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
