'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('Conversations');
    const promises = [];

    if (!tableDefinition.IsDeleted) {
      promises.push(queryInterface.addColumn('Conversations', 'IsDeleted',
        {
          type: Sequelize.BOOLEAN,
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
