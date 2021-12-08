'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ChatMessages');
    const promises = [];

    if (!tableDefinition.IsSaved) {
      promises.push(queryInterface.addColumn('ChatMessages', 'IsSaved',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
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
