const { getProdById } = require('../models/productModel');

const NUM = 0;
const code = 422;

const errors = {
  nameLength: '"name" length must be at least 5 characters long',
  quantType: '"quantity" must be a number',
  quantAmount: '"quantity" must be larger than or equal to 1',
  name: 'Product already exists',
  id: 'Wrong id format',
  amount: 'Such amount is not permitted to sell',
};

const nameLength = (value, min) => value.length <= min;
const isNumber = (value) => typeof value !== 'number';
const lessThanZero = (value) => value <= NUM;

const validate = async (name, quantity) => {
  const len = 5;

  switch (true) {
  case nameLength(name, len): return { code, message: errors.nameLength };
  case isNumber(quantity): return { code, message: errors.quantType };
  case lessThanZero(quantity): return { code, message: errors.quantAmount };
  default: return {};
  }
};

const validateQuantity = async (quantity, id) => {
  const err = 'Wrong product ID or invalid quantity';
  const item = await getProdById(id);
  if (!item) return { code, message: err };
  switch (true) {
  case isNumber(quantity): return { code, message: err };
  case lessThanZero(quantity): return { code, message: err };
  case +quantity > +item.quantity: return { code: 404, message: errors.amount };
  default: return {};
  }
};

const validateId = async (id) => {
  const pattern = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
  if (id.length !== 24 || !id.match(pattern)) return { code, message: errors.id };
  const prod = await getProdById(id);
  if (!prod) return { code, message: errors.id };
  return {};
};

module.exports = { validate, validateId, validateQuantity };
