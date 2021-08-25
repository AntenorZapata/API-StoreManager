const { createProd,
  getAllProds,
  getProdById,
  deleteProduct,
  updateProd } = require('../models/productModel');


const validateName = async (name) => {
  const allProducts = await getAllProds();
  const prodByName = allProducts.products.find((item) => item.name === name);
  if (prodByName) return true;
  return false;
};

const createProduct = async (name, quantity) => {
  const nameValidation = await validateName(name);


  if(!nameValidation) {
    const product = await createProd(name, quantity);
    return product;
  } else {
    return { err: {
      code: 'invalid_data',
      message: 'Product already exists'
    } };
  }

};

const getAllProducts = async () => {
  const response = await getAllProds();
  return response;
};

const getProductById = async (id) => {
  const response = await getProdById(id);
  return response;
};

const updateProduct = async (id, name, quantity) => {
  const product = await updateProd(id, name, quantity);
  return product;
};

const removeProduct = async (id) => {
  const product = await deleteProduct(id);
  return product;

};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  removeProduct
};
