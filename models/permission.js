'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        through: 'RolePermission',
        as: 'roles',
        foreignKey: 'perm_id',
      });
    }
  }

  Permission.init(
    {
      perm_name: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'Permission name already exists',
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Permission',
    }
  );
  return Permission;
};
