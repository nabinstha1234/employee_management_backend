'use strict';

const vars = require('../config/vars');

const {
  permissions: {
    employee: { CAN_CREATE_EMPLOYEE, CAN_UPDATE_EMPLOYEE, CAN_DELETE_EMPLOYEE, CAN_VIEW_EMPLOYEE },
    user: { CAN_CREATE_USER, CAN_DELETE_USER, CAN_UPDATE_USER, CAN_VIEW_USER },
  },
} = vars;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Permissions',
      [
        {
          perm_name: CAN_CREATE_EMPLOYEE,
          perm_description: 'Can Create Employee',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          perm_name: CAN_VIEW_EMPLOYEE,
          perm_description: 'Can View Employee',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          perm_name: CAN_UPDATE_EMPLOYEE,
          perm_description: 'Can Edit Employee',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          perm_name: CAN_DELETE_EMPLOYEE,
          perm_description: 'Can delete Employee',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          perm_name: CAN_CREATE_USER,
          perm_description: 'Can Create User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          perm_name: CAN_VIEW_USER,
          perm_description: 'Can View User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          perm_name: CAN_UPDATE_USER,
          perm_description: 'Can Update User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          perm_name: CAN_DELETE_USER,
          perm_description: 'Can delete User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Permissions', null, {});
  },
};
