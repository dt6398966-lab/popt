'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if user already exists
    const [existingUsers] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'user@99acres.com'"
    );
    
    if (existingUsers && existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await queryInterface.bulkInsert('users', [{
        name: 'Sample User',
        email: 'user@99acres.com',
        phone: '9876543210',
        password: hashedPassword,
        user_type: 'seller',
        is_verified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'user@99acres.com' }, {});
  }
};

