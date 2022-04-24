'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Company.hasMany(models.ImagesFiles, {
        foreignKey: 'company_id',
        as: 'imagesFiles',
      })
      Company.belongsToMany(models.Employee, {
        through: 'EmployeeCompany',
        foreignKey:"employee_id",
        as: 'employee',
      })
    }
  }
  Company.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    name_kana:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    address: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    zip_code:{
      type:DataTypes.STRING
    },
    phone: {
      type:DataTypes.STRING
    },
    email: {
      type:DataTypes.STRING,
      allowNull:false
    },
    url_of_hp: DataTypes.STRING,
    date_of_establishment: DataTypes.DATE,
    remarks: DataTypes.STRING,
    images_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};