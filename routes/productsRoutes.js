const express = require('express');
const { createProduct } = require('../controllers/productsController');

const router = express.Router();

router.route('/').post(createProduct);

module.exports = router;
