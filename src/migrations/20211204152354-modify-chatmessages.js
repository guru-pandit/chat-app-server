'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ChatMessages');
    const promises = [];

    if (!tableDefinition.ConversationID) {
      promises.push(queryInterface.addColumn('ChatMessages', 'ConversationID',
        {
          type: Sequelize.INTEGER,
        },
      ));
    }
    if (tableDefinition.ReceiverID) {
      promises.push(queryInterface.removeColumn('ChatMessages', 'ReceiverID'));
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
