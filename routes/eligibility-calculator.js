const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('eligibility-calculator', {
        title: 'Loan Eligibility Calculator - Home Loan Eligibility Calculator | 99acres'
    });
});

module.exports = router;

