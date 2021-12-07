'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ConnectionDetails');
    const promises = [];

    if (!tableDefinition.DisconnectedAt) {
      promises.push(queryInterface.addColumn('ConnectionDetails', 'DisconnectedAt',
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
