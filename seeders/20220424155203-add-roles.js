'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
     await queryInterface.bulkInsert('Roles', [
       {
          role_name: 'SuperAdmin',
          role_description: 'Can do everything',
          createdAt: new Date(),
          updatedAt: new Date()
       },{
          role_name: 'Admin',
          role_description: 'Can do everything',
          createdAt: new Date(),
          updatedAt: new Date()
       },
       {
          role_name: 'Employee',
          role_description: 'Can do everything',
          createdAt: new Date(),
          updatedAt: new Date()
       }
    ], {});
  
  },

  async down (queryInterface, Sequelize) {
  
     await queryInterface.bulkDelete('Roles', null, {});
   
  }
};
