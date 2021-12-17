'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('SessionData');
    const promises = [];

    if (tableDefinition.UserID) {
      promises.push(queryInterface.removeColumn('SessionData', 'UserID'));
    }
    return Promise.all(promises);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
