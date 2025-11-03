const { Property, User } = require('../models');
const { Op } = require('sequelize');

exports.getHomepage = async (req, res) => {
  try {
    // Get featured properties
    const featuredProperties = await Property.findAll({
      where: { 
        is_featured: true, 
        is_active: true 
      },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'phone']
      }],
      order: [['createdAt', 'DESC']],
      limit: 6
    });

    // Get latest properties
    const latestProperties = await Property.findAll({
      where: { is_active: true },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'phone']
      }],
      order: [['createdAt', 'DESC']],
      limit: 12
    });

    // Get properties by type for different sections
    const apartmentsForSale = await Property.findAll({
      where: {
        property_type: 'Apartment',
        transaction_type: 'Sale',
        is_active: true
      },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'phone']
      }],
      limit: 6,
      order: [['createdAt', 'DESC']]
    });

    const villasForRent = await Property.findAll({
      where: {
        property_type: 'Villa',
        transaction_type: 'Rent',
        is_active: true
      },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'phone']
      }],
      limit: 6,
      order: [['createdAt', 'DESC']]
    });

    res.render('index', {
      title: '99acres - India\'s Largest Real Estate Portal',
      featuredProperties,
      latestProperties,
      apartmentsForSale,
      villasForRent
    });
  } catch (error) {
    console.error('Homepage error:', error);
    res.render('index', {
      title: '99acres - India\'s Largest Real Estate Portal',
      featuredProperties: [],
      latestProperties: [],
      apartmentsForSale: [],
      villasForRent: []
    });
  }
};

