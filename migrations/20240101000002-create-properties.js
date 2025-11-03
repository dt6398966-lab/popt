'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('properties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      property_type: {
        type: Sequelize.ENUM('Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'Farm House'),
        allowNull: false
      },
      transaction_type: {
        type: Sequelize.ENUM('Sale', 'Rent'),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      area: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Area in square feet'
      },
      bedrooms: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      bathrooms: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      balconies: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      furnishing_status: {
        type: Sequelize.ENUM('Furnished', 'Semi-Furnished', 'Unfurnished'),
        allowNull: true
      },
      floor_number: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      total_floors: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      parking: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      lift: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      pincode: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      amenities: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('properties', ['city']);
    await queryInterface.addIndex('properties', ['state']);
    await queryInterface.addIndex('properties', ['property_type']);
    await queryInterface.addIndex('properties', ['transaction_type']);
    await queryInterface.addIndex('properties', ['price']);
    await queryInterface.addIndex('properties', ['is_featured']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('properties');
  }
};

