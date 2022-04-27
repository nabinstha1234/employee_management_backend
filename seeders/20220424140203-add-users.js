'use strict';

const model = require('../models');
const vars = require('../config/vars');
const hashService = require('../services/bcrypt.service')();

const { Role, Permission, User } = model;

const { employee, company } = vars.permissions;

module.exports = {
  async up(queryInterface, Sequelize) {
    await Role.bulkCreate([
      { role_name: vars.roles.admin },
      { role_name: vars.roles.adminAuthority },
      { role_name: vars.roles.generalAuthority },
      { role_name: vars.roles.user },
    ]);

    await Permission.bulkCreate([
      { perm_name: employee.CAN_CREATE_EMPLOYEE },
      { perm_name: employee.CAN_VIEW_EMPLOYEE },
      { perm_name: employee.CAN_UPDATE_EMPLOYEE },
      { perm_name: employee.CAN_DELETE_EMPLOYEE },
      { perm_name: company.CAN_CREATE_COMPANY },
      { perm_name: company.CAN_VIEW_COMPANY },
      { perm_name: company.CAN_UPDATE_COMPANY },
      { perm_name: company.CAN_DELETE_COMPANY },
    ]);

    const superAdminUser = await User.create({
      name: 'John Doe',
      email: 'admin@admin.com',
      password: '$2b$10$MnTYstZ4iSzhBrYtYdh0auarUC.uh3ZYbVlV1w0tZZ1SL3EReQXr2',
      phone: '9843412405',
      status: 'active',
    });

    const superAdminRole = await Role.findOne({ where: { role_name: vars.roles.admin } });
    const superAdminPermissions = await Permission.findAll({
      where: {
        perm_name: [
          employee.CAN_CREATE_EMPLOYEE,
          employee.CAN_VIEW_EMPLOYEE,
          employee.CAN_UPDATE_EMPLOYEE,
          employee.CAN_DELETE_EMPLOYEE,
          company.CAN_CREATE_COMPANY,
          company.CAN_VIEW_COMPANY,
          company.CAN_UPDATE_COMPANY,
          company.CAN_DELETE_COMPANY,
        ],
      },
    });
    await superAdminUser.addRole(superAdminRole);
    await superAdminRole.addPermissions(superAdminPermissions);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('Permissions', null, {});
  },
};
