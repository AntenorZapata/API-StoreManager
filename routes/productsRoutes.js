const express = require('express');
const { create, getAll, update, remove } = require('../controllers/productsController');
const { validateProduct,
  validateProductId, validateName } = require('../middlewares/ProductMiddlewares');

const router = express.Router();

router.route('/').post(validateProduct, create);
router.route('/:id')
  .get(validateProductId, getAll)
  .put(validateProduct, update)
  .delete(remove);

router.route('/').get(getAll);

module.exports = router;
