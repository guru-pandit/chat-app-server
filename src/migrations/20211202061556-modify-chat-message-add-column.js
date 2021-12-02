'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ChatMessages');
    const promises = [];

    if (!tableDefinition.MessageSentAt) {
      promises.push(queryInterface.addColumn('ChatMessages', 'MessageSentAt',
        {
          type: Sequelize.DATE,
        },
      ));
    }
    if (!tableDefinition.MessageReceivedAt) {
      promises.push(queryInterface.addColumn('ChatMessages', 'MessageReceivedAt',
        {
          type: Sequelize.DATE,
        },
      ));
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
