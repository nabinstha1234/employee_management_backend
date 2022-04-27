'use strict';
const { Model } = require('sequelize');
// const bcrypt = require('bcryptjs');
const hashService = require('../services/bcrypt.service')();
const vars = require('../config/vars');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Company, {
        foreignKey: 'user_id',
        targetKey: 'id',
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter your email address',
        },
        unique: {
          args: true,
          msg: 'Email already exists',
        },
        validate: {
          isEmail: {
            args: true,
            msg: 'Please enter a valid email address',
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter your phone number',
        },
        unique: {
          args: true,
          msg: 'Phone number already exists',
        },
      },
      status: {
        type: DataTypes.ENUM('inactive', 'active', 'suspended'),
        defaultValue: 'active',
      },
      password: DataTypes.STRING,
      lastlogin: {
        type: DataTypes.DATE,
      },
      settings: DataTypes.JSON,
      company_id: DataTypes.STRING,
      emp_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      department: DataTypes.STRING,
      zip_code: DataTypes.STRING,
      address: DataTypes.STRING,
      birthday: DataTypes.DATE,
      remarks: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.prototype.hasRole = async function hasRole(role) {
    if (!role || role === 'undefined') {
      return false;
    }
    const roles = await this.getRoles();
    return !!roles.map(({ name }) => name).includes(role);
  };

  User.prototype.hasPermission = async function hasPermission(permission) {
    if (!permission || permission === 'undefined') {
      return false;
    }
    const permissions = await this.getPermissions();
    return !!permissions.map(({ name }) => name).includes(permission.name);
  };

  User.prototype.hasPermissionThroughRole = async function hasPermissionThroughRole(permission) {
    if (!permission || permission === 'undefined') {
      return false;
    }
    const roles = await this.getRoles();
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of permission.roles) {
      if (roles.filter((role) => role.name === item.name).length > 0) {
        return true;
      }
    }
    return false;
  };

  User.prototype.hasPermissionTo = async function hasPermissionTo(permission) {
    if (!permission || permission === 'undefined') {
      return false;
    }
    return (await this.hasPermissionThroughRole(permission)) || this.hasPermission(permission);
  };

  return User;
};
