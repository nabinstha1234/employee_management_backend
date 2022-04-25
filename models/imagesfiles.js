'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImagesFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ImagesFiles.hasMany(models.Company,{
      //   as:"images"
      // })
      // ImagesFiles.hasOne(models.Employee)
    }
  }
  ImagesFiles.init({
    filename: DataTypes.STRING,
    filepath: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    size: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ImagesFiles',
  });
  return ImagesFiles;
};