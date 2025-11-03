const { Property } = require('../models');
const { Op } = require('sequelize');

exports.searchProperties = async (req, res) => {
  try {
    const { 
      keyword, 
      city, 
      property_type, 
      transaction_type,
      min_price, 
      max_price,
      bedrooms,
      bathrooms,
      furnishing_status,
      parking,
      lift
    } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    const where = { is_active: true };

    // Keyword search in title, description, address
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
        { address: { [Op.like]: `%${keyword}%` } },
        { city: { [Op.like]: `%${keyword}%` } }
      ];
    }

    if (city) where.city = { [Op.like]: `%${city}%` };
    if (property_type) where.property_type = property_type;
    if (transaction_type) where.transaction_type = transaction_type;
    if (bedrooms) where.bedrooms = parseInt(bedrooms);
    if (bathrooms) where.bathrooms = parseInt(bathrooms);
    if (furnishing_status) where.furnishing_status = furnishing_status;

    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = parseFloat(min_price);
      if (max_price) where.price[Op.lte] = parseFloat(max_price);
    }

    if (parking === 'true') where.parking = true;
    if (lift === 'true') where.lift = true;

    const { count, rows } = await Property.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.render('search/results', {
      title: 'Search Properties - 99acres',
      properties: rows,
      currentPage: page,
      totalPages,
      totalProperties: count,
      filters: req.query
    });
  } catch (error) {
    console.error('Search error:', error);
    req.flash('error_msg', 'Error searching properties.');
    res.redirect('/');
  }
};

