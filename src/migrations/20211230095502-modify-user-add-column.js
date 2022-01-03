'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('Users');
    const promises = [];

    if (!tableDefinition.IsSaved) {
      promises.push(queryInterface.addColumn('Users', 'DOB',
        {
          type: Sequelize.STRING(15),
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
