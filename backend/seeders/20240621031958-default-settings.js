'use strict';
const bcrypt = require('bcryptjs');
const crypto = require('../src/utils/crypto');
require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const settingsId = await queryInterface.rawSelect('settings', { where: {}, limit: 1 }, ['id']);
    if (!settingsId) {
      return queryInterface.bulkInsert('settings', [{
        email: 'gabrielcorreiajobs@hotmail.com',
        password: bcrypt.hashSync('123456'),
        apiUrl: 'https://testnet.binance.vision/api/',
        accessKey: 'X13zDk5H1wXyuxBpwO4ghe3kwBo86LO8gmeOK6JhF6QyWcxVr0dgDBEXzeVO2DsF',
        secretKey: crypto.encrypt('fgOWiajLfXOr6HwgZLcqA0ZVL12dENh8C4YOLGsZ9mmSWlt0oiiB3OsED7S03uxO'),
        createdAt: new Date(),
        updatedAt: new Date()
      }])
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('settings', null, {})
  }
};
