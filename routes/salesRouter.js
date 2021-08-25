const express = require('express');
// const { create, getAll, update, remove } = require('../controllers/productsController');
const {
  validateSaleQuantity,
  validateSaleId } = require('../middlewares/ValidationsMiddleware');

const { create,
  getAll,
  getById,
  update, remove } = require('../controllers/salesController');

const router = express.Router();

router.route('/').post(validateSaleQuantity, create);

// router.route('/').post(validateProduct, create);
router.route('/:id').get(validateSaleId, getById)
  .put(validateSaleQuantity, update)
  .delete(validateSaleId, remove);
router.route('/').get(getAll);

module.exports = router;
