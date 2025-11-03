'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Enquiry extends Model {
    static associate(models) {
      Enquiry.belongsTo(models.Property, { foreignKey: 'property_id', as: 'property' });
      Enquiry.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  Enquiry.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('new', 'contacted', 'closed'),
      defaultValue: 'new'
    }
  }, {
    sequelize,
    modelName: 'Enquiry',
    tableName: 'enquiries'
  });

  return Enquiry;
};

