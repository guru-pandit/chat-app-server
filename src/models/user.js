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
    static associate({ ConnectionDetail }) {
      User.hasOne(ConnectionDetail, { foreignKey: "UserID" });
    }
  };
  User.init({
    Name: DataTypes.STRING,
    Phone: DataTypes.STRING,
    Email: DataTypes.STRING,
    Avatar: DataTypes.STRING,
    DOB: DataTypes.STRING,
    Password: DataTypes.STRING,
    IsDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};