const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const upload = require('../middleware/upload');

router.get('/', propertyController.getAllProperties);
router.get('/create', propertyController.showCreateProperty);
router.post('/create', upload.array('images', 10), propertyController.createProperty);
router.get('/:id', propertyController.getPropertyById);
router.post('/favorite', propertyController.toggleFavorite);

module.exports = router;

