'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("assets",
      [
        {
          title: "اُنس طلا",
          symbol: "XAUUSD",
          type: "gold"
        },
        {
          title: "آب شده",
          symbol: "IR_GOLD_MELTED",
          type: "gold"
        },
        {
          title: "طلا 18 عیار",
          symbol: "IR_GOLD_18K",
          type: "gold"
        },
        {
          title: "طلا 24 عیار",
          symbol: "IR_GOLD_24K",
          type: "gold"
        },
        {
          title: "سکه امامی",
          symbol: "IR_COIN_EMAMI",
          type: "gold"
        },
        {
          title: "سکه بهار آزادی",
          symbol: "IR_COIN_BAHAR",
          type: "gold"
        },
        {
          title: "نیم سکه",
          symbol: "IR_COIN_HALF",
          type: "gold"
        },
        {
          title: "ربع سکه",
          symbol: "IR_COIN_QUARTER",
          type: "gold"
        },
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('assets', {
      symbol: [
        "XAUUSD",
        "IR_GOLD_MELTED",
        "IR_GOLD_18K",
        "IR_GOLD_24K",
        "IR_COIN_EMAMI",
        "IR_COIN_BAHAR",
        "IR_COIN_HALF",
        "IR_COIN_QUARTER"
      ]
    }, {});
  }
};
