const express = require('express');
const { createProd } = require('../controllers/productsController');
const { validateProduct } = require('../middlewares/ProductMiddlewares');

const router = express.Router();

router.route('/').post(validateProduct, createProd);

module.exports = router;
