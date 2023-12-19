const express = require('express');
const { getCompany } = require('../controllers/user.js');
const router = express.Router();

router.route('/:id').get(getCompany);

module.exports = router;
