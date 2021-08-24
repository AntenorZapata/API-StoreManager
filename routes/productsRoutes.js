const express = require('express');
const { create, getAll, update } = require('../controllers/productsController');
const { validateProduct,
  validateProductId, validateName } = require('../middlewares/ProductMiddlewares');

const router = express.Router();

router.route('/').post(validateProduct, create);
router.route('/:id').get(validateProductId, getAll).put(validateProduct, update);
router.route('/').get(getAll);

module.exports = router;
