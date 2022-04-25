'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Employee.belongsTo(models.Users,{
      //   foreignKey: 'user_id',
      // })
      // Employee.belongsTo(models.Company,{
      //   foreignKey: 'company_id',
      // });
      // Employee.belongsTo(models.Imagesfiles,{
      //   foreignKey: 'imagesfiles_id',
      // })
    }
  }
  Employee.init(
    {
      emp_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      department: DataTypes.STRING,
      zip_code: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      birthday: DataTypes.DATE,
      remarks: DataTypes.STRING,
      imageFiles_id: DataTypes.STRING,
      company_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Employee',
    }
  );
  return Employee;
};
