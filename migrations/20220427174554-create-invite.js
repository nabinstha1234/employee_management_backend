'use strict';
const crypto = require('crypto');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        required: true,
      },
      token: {
        type: Sequelize.STRING,
        required: true,
        defaultValue: crypto.randomBytes(40).toString('hex'),
      },
      expiry: {
        type: Sequelize.DATE,
        required: true,
        defaultValue: Date.now() + 10 * 60 * 1000,
      },
      user_id: {
        type: Sequelize.INTEGER,
        required: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invites');
  },
};
