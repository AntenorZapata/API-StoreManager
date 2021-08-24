const { createProd, getAllProds } = require('../models/productModel');

const createProduct = async (name, quantity) => {
  const product = await createProd(name, quantity);
  return product;
};

const getAllProducts = async () => {
  const response = await getAllProds();
  return response;
};

module.exports = {
  createProduct,
  getAllProducts,
};
