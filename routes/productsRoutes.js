const express = require('express');
const { createProd } = require('../controllers/productsController');

const router = express.Router();

router.route('/').post(createProd);

module.exports = router;
