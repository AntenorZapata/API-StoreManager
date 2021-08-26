const express = require('express');

const {
  validateSaleQuantity,
  validateSaleId } = require('../middlewares/ValidationsMiddleware');

const { create,
  getAll,
  getById,
  update, remove } = require('../controllers/salesController');

const router = express.Router();

router.route('/').post(validateSaleQuantity, create);

router.route('/:id').get(validateSaleId, getById)
  .put(validateSaleQuantity, update)
  .delete(validateSaleId, remove);
router.route('/').get(getAll);

module.exports = router;
