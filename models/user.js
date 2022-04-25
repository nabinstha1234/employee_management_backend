'use strict';
const {
  Model
} = require('sequelize');
// const bcrypt = require('bcryptjs'); 
const hashService = require('../services/bcrypt.service')();
const vars = require("../config/vars");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User.hasOne(models.Employee)
      // User.hasOne(models.Role, {
      //   foreignKey: 'user_id',
      //   as: 'role',
      // });
      // User.hasOne(models.UserToken,{
      //   foreignKey: 'user_id',
      // })
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
    },
    profile_img:{
      type:DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeSave(async (user) => {
    if (user.password) {
      user.password = await hashService.hash(user.password, vars.saltRounds);
    }
  });
  User.prototype.comparePassword = function (passw, cb) {
    const isPasswordCorrect= hashService.compare(passw, this.password);
    if(isPasswordCorrect){
      return cb(null, isPasswordCorrect);
    }}
  return User;
};