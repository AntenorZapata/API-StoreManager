const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  removeProduct,
} = require('../services/productService');
const catchAsync = require('../utils/catchAsync');

const STATUS_CREATED_SUCCESS = 201;
const STATUS_SUCCESS = 200;

const create = catchAsync(async (req, res) => {
  const { name, quantity } = req.body;
  const product = await createProduct(name, quantity);
  return res.status(STATUS_CREATED_SUCCESS).json({ ...product });
});

const getAll = catchAsync(async (req, res) => {
  const products = await getAllProducts();
  res.status(STATUS_SUCCESS).json(products);
});

const getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await getProductById(id);
  return res.status(STATUS_SUCCESS).json(product);
});

const update = catchAsync(async (req, res) => {
  const { name, quantity } = req.body;
  const { id } = req.params;
  const product = await updateProduct(id, name, quantity);
  return res.status(STATUS_SUCCESS).json({ ...product });
});

const remove = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await removeProduct(id);
  res.status(STATUS_SUCCESS).json(product);
});

module.exports = {
  create,
  getAll,
  update,
  remove,
  getById,
};
