'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConnectionDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ConnectionDetail.init({
    UserID: DataTypes.INTEGER,
    SocketID: DataTypes.STRING,
    IsConnected: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ConnectionDetail',
  });
  return ConnectionDetail;
};