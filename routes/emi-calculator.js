const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('emi-calculator', {
        title: 'EMI Calculator - Home Loan EMI Calculator | 99acres'
    });
});

module.exports = router;

