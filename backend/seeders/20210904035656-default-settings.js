'use strict';
const bcrypt = require('bcryptjs');
const { encrypt } = require('../src/utils/crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const settingsId = await queryInterface.rawSelect('settings', { where: {}, limit: 1 }, ['id']);
    if (!settingsId) {
      return queryInterface.bulkInsert('settings', [{
        email: 'contato@luiztools.com.br',
        password: bcrypt.hashSync('123456'),
        apiUrl: 'https://testnet.binance.vision/api',
        streamUrl: 'wss://testnet.binance.vision/ws',
        accessKey: '<SUA ACCESS KEY>',
        secretKey: encrypt('<SUA SECRET KEY>'),
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Settings', null, {});
  }
};
