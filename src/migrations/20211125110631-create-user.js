'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      Phone: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING(50)
      },
      Avatar: {
        type: Sequelize.STRING
      },
      DOB: {
        type: Sequelize.STRING
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      IsDeleted: {
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
    await queryInterface.dropTable('Users');
  }
};