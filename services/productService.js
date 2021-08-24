const { createProd, getAllProds, getProdById } = require('../models/productModel');

const createProduct = async (name, quantity) => {
  const product = await createProd(name, quantity);
  return product;
};

const getAllProducts = async () => {
  const response = await getAllProds();
  return response;
};

const getProductById = async (id) => {
  console.log(id);
  const response = await getProdById(id);
  return response;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
};
