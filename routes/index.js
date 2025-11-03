const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const enquiryController = require('../controllers/enquiryController');

router.get('/', indexController.getHomepage);
router.post('/enquiry', enquiryController.createEnquiry);

module.exports = router;

