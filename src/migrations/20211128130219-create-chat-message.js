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
      ReceiverID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      IsReceived: {
        type: Sequelize.BOOLEAN,
      },
      IsDeleted: {
        type: Sequelize.BOOLEAN,
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