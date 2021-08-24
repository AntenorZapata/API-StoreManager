const express = require('express');
const { create, getAll } = require('../controllers/productsController');
const { validateProduct } = require('../middlewares/ProductMiddlewares');

const router = express.Router();

router.route('/').get(getAll).post(validateProduct, create);

module.exports = router;
