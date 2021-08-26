const { getAllProds, getProdById } = require('../models/productModel');

const NUM = 0;
const code = 422;

const errors = {
  name_length: '"name" length must be at least 5 characters long',
  quant_type: '"quantity" must be a number',
  quant_amount: '"quantity" must be larger than or equal to 1',
  name: 'Product already exists',
  id: 'Wrong id format',
  amount: 'Such amount is not permitted to sell'
};


// const isNotString = (value) => typeof value !== 'string';
const nameLength = (value, min) => value.length <= min;
const isNumber = (value) => typeof value !== 'number';
const lessThanZero = (value) => value <= NUM;


const validate = async (name, quantity) => {
  const len  = 5;

  switch (true) {
  case nameLength(name, len): return { code, message: errors.name_length };
  case isNumber(quantity): return { code, message: errors.quant_type };
  case lessThanZero(quantity): return { code, message: errors.quant_amount };
  default: return {};
  }

};

const validateQuantity = async (quantity, id) => {
  const item = await getProdById(id);
  const err =  'Wrong product ID or invalid quantity';
  switch (true) {
  case isNumber(quantity): return { code, message:  err};
  case lessThanZero(quantity): return { code, message: err };
  case +quantity > +item.quantity: return {code: 404, message: errors.amount };
  default: return {};
  }
};


const validateId = async (id) => {

  const allProducts = await getAllProds();
  const prodById = allProducts.products.find((item) => item._id.equals(id));

  if (!prodById) return { code, message: errors.id };
  return {};
};


module.exports = { validate, validateId, validateQuantity };
