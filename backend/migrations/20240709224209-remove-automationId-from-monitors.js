'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('monitors', 'automationId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('monitors', 'automationId', {
      type: Sequelize.INTEGER
    });
  }
};