'use strict';
const moment = require("moment");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Conversation }) {
      ChatMessage.belongsTo(Conversation, { foreignKey: "ConversationID" })
    }
  };
  ChatMessage.init({
    Body: DataTypes.TEXT,
    SenderID: DataTypes.INTEGER,
    ConversationID: DataTypes.INTEGER,
    IsReceived: DataTypes.BOOLEAN,
    IsDeleted: DataTypes.BOOLEAN,
    MessageSentAt: DataTypes.DATE,
    MessageReceivedAt: DataTypes.DATE,
    IsRead: DataTypes.BOOLEAN,
    IsSaved: DataTypes.BOOLEAN,
    GroupDate: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${moment(this.MessageSentAt).format('D MMMM YYYY')}`;
      },
    }
  }, {
    sequelize,
    modelName: 'ChatMessage',
  });
  return ChatMessage;
};