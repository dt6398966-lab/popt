const { Enquiry } = require('../models');

exports.createEnquiry = async (req, res) => {
  try {
    const { property_id, name, email, phone, message } = req.body;

    if (!property_id) {
      req.flash('error_msg', 'Invalid property ID.');
      return res.redirect('/properties');
    }

    await Enquiry.create({
      property_id: parseInt(property_id),
      user_id: req.session.user ? req.session.user.id : null,
      name,
      email,
      phone,
      message: message || ''
    });

    req.flash('success_msg', 'Your enquiry has been submitted successfully!');
    res.redirect(`/properties/${property_id}`);
  } catch (error) {
    console.error('Error creating enquiry:', error);
    req.flash('error_msg', 'Error submitting enquiry. Please try again.');
    const property_id = req.body.property_id;
    if (property_id) {
      res.redirect(`/properties/${property_id}`);
    } else {
      res.redirect('/properties');
    }
  }
};

