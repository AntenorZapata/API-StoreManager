const { createProduct } = require('../services/productService');
const STATUS_SUCCESS = 200;

const createProd = async (req, res) => {
  const { name, quantity } = req.body;

  const product = await createProduct(name, quantity);

  return res.status(STATUS_SUCCESS).json({ product });
};

module.exports = {
  createProd,
};
