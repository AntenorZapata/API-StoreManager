const express = require('express');
const { create,
  getAll, update,
  remove, getById } = require('../controllers/productsController');
const { validateProduct,
  validateProductId } = require('../middlewares/ValidationsMiddleware');

const router = express.Router();

router.route('/').post(create);

router.route('/:id')
  .get(getById)
  .put(update)
  .delete(validateProductId, remove);

router.route('/').get(getAll);

module.exports = router;
