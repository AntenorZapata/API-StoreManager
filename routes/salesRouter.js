const express = require('express');
// const { create, getAll, update, remove } = require('../controllers/productsController');
// const { validateProduct,
//   validateProductId, validateName } = require('../middlewares/ProductMiddlewares');
const {create} = require('../controllers/salesController');

const router = express.Router();

router.route('/').post(create);


// router.route('/').post(validateProduct, create);
// router.route('/:id')
//   .get(validateProductId, getAll)
//   .put(validateProduct, update)
//   .delete(validateProductId, remove);
// router.route('/').get(getAll);

module.exports = router;
