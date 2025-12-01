'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("populars",
      [
        {
          asset_id: 1
        },
        {
          asset_id: 2
        },
        {
          asset_id: 21
        },
        {
          asset_id: 24
        },
        {
          asset_id: 25
        },
        {
          asset_id: 26
        },
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('populars', {
      asset_id: [
        1,
        2,
        21,
        24,
        25,
        26,
      ]
    }, {});
  }
};
