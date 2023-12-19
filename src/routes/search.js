const express = require('express');
const { handleSearch, handlingSearchForCompany } = require('../controllers/search.js');
const { verifyToken } = require('../middlewares/auth.js');

const router = express.Router();
router.route('/').get(handleSearch);

router.route('/company').get(verifyToken, handlingSearchForCompany);

module.exports = router;
