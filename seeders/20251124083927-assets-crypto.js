'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("assets",
      [
        {
          title: "تتر",
          symbol: "USDT",
          type: "crypto"
        },
        {
          title: "بیت‌ کوین",
          symbol: "BTC",
          type: "crypto"
        },
        {
          title: "اتریوم",
          symbol: "ETH",
          type: "crypto"
        },
        {
          title: "نات کوین",
          symbol: "NOT",
          type: "crypto"
        },
        {
          title: "دوج کوین",
          symbol: "DOGE",
          type: "crypto"
        },
        {
          title: "تون کوین",
          symbol: "TON",
          type: "crypto"
        },
        {
          title: "ترون",
          symbol: "TRX",
          type: "crypto"
        }
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('assets', {
      symbol: [
        "USDT",
        "BTC",
        "ETH",
        "NOT",
        "DOGE",
        "TON",
        "TRX"
      ]
    }, {});
  }
};
