const ProducSchema = require('../schemas/ProductSchema');
const { findById } = require('../models/saleModel');

const validateProduct = async (req, res, next) => {
  const { name, quantity } = req.body;

  // const bad_request = 400;
  const validations = await ProducSchema.validate(name, quantity);

  if (validations.message) {
    return res.status(validations.code).json({
      err: {
        code: 'invalid_data',
        message: validations.message,
      },
    });
  }

  next();
};

const validateProductId = async (req, res, next) => {
  const { id } = req.params;

  const validations = await ProducSchema.validateId(id);

  if (validations.message) {
    return res.status(validations.code).json({
      err: {
        code: 'invalid_data',
        message: validations.message,
      },
    });
  }
  next();
};

const validateSaleQuantity = async (req, res, next) => {
  const body = req.body;
  let validation = {};

  body.forEach((sale) => {
    validation = ProducSchema.validateQuantity(sale.quantity);
  });

  if (validation.message) {
    return res.status(validation.code).json({
      err: {
        code: 'invalid_data',
        message: validation.message,
      },
    });
  }
  next();
};

const validateSaleId = async (req, res, next) => {
  const { id } = req.params;
  const BAD_REQUEST = 404;
  const len = 24;

  if (id.length !== len || !(await findById(id))) {
    return res.status(BAD_REQUEST).json({
      err: {
        code: 'not_found',
        message: 'Sale not found',
      },
    });
  }

  next();
};

module.exports = {
  validateProduct,
  validateProductId,
  validateSaleQuantity,
  validateSaleId,
};
