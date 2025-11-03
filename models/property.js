'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    static associate(models) {
      Property.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
      Property.hasMany(models.Enquiry, { foreignKey: 'property_id', as: 'enquiries' });
      Property.hasMany(models.Favorite, { foreignKey: 'property_id', as: 'favorites' });
    }
  }

  Property.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    property_type: {
      type: DataTypes.ENUM('Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'Farm House'),
      allowNull: false
    },
    transaction_type: {
      type: DataTypes.ENUM('Sale', 'Rent'),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    balconies: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    furnishing_status: {
      type: DataTypes.ENUM('Furnished', 'Semi-Furnished', 'Unfurnished'),
      allowNull: true
    },
    floor_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_floors: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    parking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lift: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Property',
    tableName: 'properties'
  });

  return Property;
};

