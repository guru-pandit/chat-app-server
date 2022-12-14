'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ChatMessages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Body: {
        type: Sequelize.TEXT
      },
      SenderID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ConversationID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      IsReceived: {
        type: Sequelize.BOOLEAN,
      },
      IsDeleted: {
        type: Sequelize.BOOLEAN,
      },
      MessageSentAt: {
        type: Sequelize.DATE
      },
      MessageReceivedAt: {
        type: Sequelize.DATE
      },
      IsRead: {
        type: Sequelize.BOOLEAN
      },
      IsSaved: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ChatMessages');
  }
};