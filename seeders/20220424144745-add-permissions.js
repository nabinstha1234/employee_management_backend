'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Permissions', [
      {
        perm_name: 'create-employee',
        perm_description: 'Can Create Employee',
        createdAt: new Date(),
        updatedAt: new Date()
     },
      {
        perm_name: 'view-employee',
        perm_description: 'Can View Employee',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
          perm_name: 'edit-employee',
          perm_description: 'Can Edit Employee',
          createdAt: new Date(),
          updatedAt: new Date()
      },
      {
          perm_name: 'delete-employee',
          perm_description: 'Can delete Employee',
          createdAt: new Date(),
          updatedAt: new Date()
      }
     ], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Permissions', null, {});
  }
};
