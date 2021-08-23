const { createProd } = require('../models/productModel');

const createProduct = async (name, quantity) => {
  const product = await createProd(name, quantity);

  return product;
};

module.exports = {
  createProduct,
};
