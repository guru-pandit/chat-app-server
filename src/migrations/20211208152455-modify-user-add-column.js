'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('Users');
    const promises = [];

    if (!tableDefinition.Avatar) {
      promises.push(queryInterface.addColumn('Users', 'Avatar',
        { type: Sequelize.STRING, },
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
