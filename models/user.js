'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Role, {
        foreignKey: 'user_id',
        as: 'role',
      });
    }
  }
  User.init({
    role_id: DataTypes.INTEGER,
    email:{ 
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    password: DataTypes.STRING,
    firstname: {
      type:DataTypes.STRING,
      allowNull:false
    },
    middlename:{
       type:DataTypes.STRING,
       allowNull:true
      },
    lastname: {
      type:DataTypes.STRING,
      allowNull:false
    },
    isemailverified:{
      type: DataTypes.BOOLEAN,
      default: false
    },
    lastlogin: {
      type:DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};