'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("assets",
      [
        {
          title: "دلار آمریکا",
          symbol: "USD",
          type: "currency"
        },
        {
          title: "یورو",
          symbol: "EUR",
          type: "currency"
        },
        {
          title: "پوند",
          symbol: "GBP",
          type: "currency"
        },
        {
          title: "دلار کانادا",
          symbol: "CAD",
          type: "currency"
        },
        {
          title: "یو آن چین",
          symbol: "CNY",
          type: "currency"
        },
        {
          title: "درهم امارات",
          symbol: "AED",
          type: "currency"
        },
        {
          title: "لیر ترکیه",
          symbol: "TRY",
          type: "currency"
        },
        {
          title: "ریال عربستان",
          symbol: "SAR",
          type: "currency"
        },
        {
          title: "فرانک سوئیس",
          symbol: "CHF",
          type: "currency"
        },
        {
          title: "دینار عراق",
          symbol: "IQD",
          type: "currency"
        },
        {
          title: "ریال قطر",
          symbol: "QAR",
          type: "currency"
        },
        {
          title: "ریال عمان",
          symbol: "OMR",
          type: "currency"
        },
        {
          title: "دینار بحرین",
          symbol: "BHD",
          type: "currency"
        },
        {
          title: "افغانی",
          symbol: "AFN",
          type: "currency"
        },
        {
          title: "روبل روسیه",
          symbol: "RUB",
          type: "currency"
        },
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('assets', {
      symbol: [
        "USD", "EUR", "GBP", "CAD", "CNY", "AED",
        "TRY", "SAR", "CHF", "IQD", "QAR", "OMR",
        "BHD", "AFN", "RUB"
      ]
    }, {});
  }
};
