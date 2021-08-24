const express = require('express');
const { create, getAll } = require('../controllers/productsController');
const { validateProduct,
  validateProductId } = require('../middlewares/ProductMiddlewares');

const router = express.Router();

router.route('/').post(validateProduct, create);
router.route('/:id').get(validateProductId, getAll);
router.route('/').get(getAll);

module.exports = router;
