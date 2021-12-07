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
    static associate({ User }) {
      ConnectionDetail.belongsTo(User, { foreignKey: "UserID" });
    }
  };
  ConnectionDetail.init({
    UserID: DataTypes.INTEGER,
    SocketID: DataTypes.STRING,
    IsConnected: DataTypes.BOOLEAN,
    DisconnectedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'ConnectionDetail',
  });
  return ConnectionDetail;
};