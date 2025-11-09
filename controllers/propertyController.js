const { Property, User, Favorite } = require('../models');
const { Op } = require('sequelize');

exports.getAllProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    const where = { is_active: true };
    const userWhere = {};

    // Filters
    if (req.query.city) where.city = { [Op.like]: `%${req.query.city}%` };
    if (req.query.property_type) where.property_type = req.query.property_type;
    if (req.query.transaction_type) where.transaction_type = req.query.transaction_type;
    if (req.query.min_price) where.price = { ...where.price, [Op.gte]: req.query.min_price };
    if (req.query.max_price) {
      where.price = { 
        ...where.price, 
        [Op.lte]: req.query.max_price,
        [Op.gte]: req.query.min_price || 0
      };
    }
    if (req.query.bedrooms) where.bedrooms = req.query.bedrooms;

    // Advertiser type filter (Dealer/Owner)
    if (req.query.advertiser_type) {
      if (req.query.advertiser_type === 'dealer') {
        // Dealer includes agents and builders
        userWhere.user_type = { [Op.in]: ['agent', 'builder'] };
      } else if (req.query.advertiser_type === 'owner') {
        // Owner means individual sellers
        userWhere.user_type = 'seller';
      }
    }

    const includeOptions = [{
      model: User,
      as: 'owner',
      attributes: ['id', 'name', 'email', 'phone', 'user_type'],
      where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
      required: Object.keys(userWhere).length > 0
    }];

    const { count, rows } = await Property.findAndCountAll({
      where,
      include: includeOptions,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.render('properties/list', {
      title: 'Properties - 99acres',
      properties: rows,
      currentPage: page,
      totalPages,
      totalProperties: count,
      filters: req.query
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    req.flash('error_msg', 'Error loading properties.');
    res.redirect('/');
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'phone']
      }]
    });

    if (!property || !property.is_active) {
      req.flash('error_msg', 'Property not found.');
      return res.redirect('/properties');
    }

    // Increment views
    await property.increment('views');

    // Check if user has favorited this property
    let isFavorite = false;
    if (req.session.user) {
      const favorite = await Favorite.findOne({
        where: {
          user_id: req.session.user.id,
          property_id: property.id
        }
      });
      isFavorite = !!favorite;
    }

    // Get similar properties
    const similarProperties = await Property.findAll({
      where: {
        id: { [Op.ne]: property.id },
        city: property.city,
        property_type: property.property_type,
        transaction_type: property.transaction_type,
        is_active: true
      },
      limit: 6,
      order: [['createdAt', 'DESC']]
    });

    res.render('properties/detail', {
      title: `${property.title} - 99acres`,
      property,
      isFavorite,
      similarProperties
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    req.flash('error_msg', 'Error loading property details.');
    res.redirect('/properties');
  }
};

exports.showCreateProperty = (req, res) => {
  if (!req.session.user) {
    req.flash('error_msg', 'Please login to post a property.');
    return res.redirect('/auth/login');
  }
  res.render('properties/create', { title: 'Post Property - 99acres' });
};

exports.createProperty = async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash('error_msg', 'Please login to post a property.');
      return res.redirect('/auth/login');
    }

    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/properties/${file.filename}`);
    }

    // Process amenities string to array
    let amenities = [];
    if (req.body.amenities && typeof req.body.amenities === 'string') {
      amenities = req.body.amenities.split(',').map(a => a.trim()).filter(a => a);
    } else if (Array.isArray(req.body.amenities)) {
      amenities = req.body.amenities;
    }

    const propertyData = {
      ...req.body,
      user_id: req.session.user.id,
      price: parseFloat(req.body.price) || 0,
      area: parseFloat(req.body.area) || 0,
      bedrooms: parseInt(req.body.bedrooms) || 0,
      bathrooms: parseInt(req.body.bathrooms) || 0,
      balconies: parseInt(req.body.balconies) || 0,
      floor_number: req.body.floor_number ? parseInt(req.body.floor_number) : null,
      total_floors: req.body.total_floors ? parseInt(req.body.total_floors) : null,
      latitude: req.body.latitude ? parseFloat(req.body.latitude) : null,
      longitude: req.body.longitude ? parseFloat(req.body.longitude) : null,
      parking: req.body.parking === 'on',
      lift: req.body.lift === 'on',
      amenities: amenities,
      images: images
    };

    const property = await Property.create(propertyData);
    req.flash('success_msg', 'Property posted successfully!');
    res.redirect(`/properties/${property.id}`);
  } catch (error) {
    console.error('Error creating property:', error);
    req.flash('error_msg', error.message || 'Error posting property. Please try again.');
    res.redirect('/properties/create');
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({ error: 'Please login to add favorites.' });
    }

    const property_id = parseInt(req.body.property_id);
    const user_id = req.session.user.id;

    const existing = await Favorite.findOne({
      where: { user_id, property_id }
    });

    if (existing) {
      await existing.destroy();
      return res.json({ favorited: false });
    } else {
      await Favorite.create({ user_id, property_id });
      return res.json({ favorited: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.json({ error: 'Error updating favorite.' });
  }
};

