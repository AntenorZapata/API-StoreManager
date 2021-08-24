const { createProduct,
  getAllProducts,
  getProductById } = require('../services/productService');

const STATUS_CREATED_SUCCESS = 201;
const STATUS_SUCCESS = 200;

const create = async (req, res) => {
  const { name, quantity } = req.body;
  const product = await createProduct(name, quantity);
  return res.status(STATUS_CREATED_SUCCESS).json({ ...product });
};

const getAll = async (req, res) => {
  const { id } = req.params;

  if (id) {
    const product = await getProductById(id);
    return res.status(STATUS_SUCCESS).json(product);
  }
  const products = await getAllProducts();
  res.status(STATUS_SUCCESS).json(products);
};

module.exports = {
  create,
  getAll,
};
