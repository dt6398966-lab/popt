const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('area-converter', {
        title: 'Area converter - Land Area Converter - Land measurement calculator | 99acres'
    });
});

module.exports = router;

