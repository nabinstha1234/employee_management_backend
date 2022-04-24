'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.hasOne(models.User, {
        foreignKey: 'employee_id',
        as: 'employee',
      });
      Employee.hasOne(models.Company, {
        foreignKey: 'employee_id',
        as: 'company'
      });
      Employee.hasOne(models.ImagesFiles, {
        foreignKey: 'employee_id',
        as: 'images'
      });
    }
  }
  Employee.init({
    emp_number: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    department: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    birthday: DataTypes.DATE,
    remarks: DataTypes.STRING,
    profile_image: DataTypes.STRING,
    company_id: DataTypes.STRING,
    user_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};