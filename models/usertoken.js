'use strict';
const { Model } = require('sequelize');
const bcryptService = require('../services/bcrypt.service')();

const PROTECTED_ATTRIBUTES = ['token'];

module.exports = (sequelize, DataTypes) => {
  class UserToken extends Model {
    toJSON() {
      // hide protected fields
      const attributes = { ...this.get() };
      // eslint-disable-next-line no-restricted-syntax
      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserToken.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'owner',
        onDelete: 'CASCADE',
      });

      models.User.hasMany(UserToken, {
        foreignKey: 'user_id',
        as: 'tokens',
        onDelete: 'CASCADE',
      });
    }

    static async findToken(authorizationToken) {
      if (authorizationToken) {
        let accessToken;
        if (!authorizationToken.includes('|')) {
          accessToken = await this.findOne({
            where: { token: bcryptService.hash(authorizationToken) },
            include: 'owner',
          });
        } else {
          const [id, kToken] = authorizationToken.split('|', 2);
          const instance = await this.findByPk(id, { include: 'owner' });
          if (instance) {
            accessToken = bcryptService.compare(instance.token, bcryptService.hash(kToken)) ? instance : null;
          }
        }

        if (!accessToken) return { user: null, currentAccessToken: null };

        accessToken.last_used_at = new Date(Date.now());
        await accessToken.save();
        return { user: accessToken.owner, currentAccessToken: accessToken.token };
      }

      return { user: null, currentAccessToken: null };
    }
  }

  UserToken.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
      token: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      last_used_at: DataTypes.DATE,
      last_ip_address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'UserToken',
    }
  );
  return UserToken;
};
