'use strict';
const crypto = require('crypto');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invite.init(
    {
      email: {
        type: DataTypes.STRING,
        required: true,
      },
      token: {
        type: DataTypes.STRING,
        required: true,
        defaultValue: crypto.randomBytes(40).toString('hex'),
      },
      expiry: {
        type: DataTypes.DATE,
        defaultValue: Date.now() + 10 * 60 * 1000,
      },
      user_id: {
        type: DataTypes.NUMBER,
        required: true,
      },
    },
    {
      sequelize,
      modelName: 'Invite',
    }
  );
  return Invite;
};
