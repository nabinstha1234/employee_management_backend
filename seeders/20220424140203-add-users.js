'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
       role_id:1, 
       email: "admin@admin.com",
       password: "$2a$12$Lbn2CdRsJ2rpEv1LbRfS/uBn9h4snoH32Ro03n17jNuP/o13xAT9C",
       firstname: "admin",
       lastname: "admin",
       isemailverified: true,
       lastlogin: new Date(),
       profile_img: "",
       createdAt: new Date(),
       updatedAt: new Date()
     }], {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Users', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
