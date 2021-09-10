const ProducSchema = require('../schemas/ProductSchema');
const { findById } = require('../models/saleModel');

const BAD_REQUEST = 404;
const UNPROC = 422;
const len = 24;

const validateProduct = async (req, res, next) => {
  const { name, quantity } = req.body;

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

const verifyQuantity = async (quantity, id) => {
  const validation = await ProducSchema
    .validateQuantity(quantity, id);

  if (validation.message) {
    return validation;
  }
  return false;
};

const validateSaleQuantity = async (req, res, next) => {
  const { body } = req;
  const index = 0;
  const badCode = 404;
  let validation = {};

  for (let i = index; i < body.length; i += 1) {
    validation = verifyQuantity(body[i].quantity, body[i].productId);
  }
  const msg = await validation;
  if (msg) {
    const code = msg.code === badCode ? 'stock_problem' : 'invalid_data';
    return res.status(msg.code).json({
      err: {
        code,
        message: msg.message,
      },

    });
  }
  next();
};

const validateSaleId = async (req, res, next) => {
  const { id } = req.params;
  const errors = {
    notFound: { code: 'not_found', message: 'Sale not found', status: BAD_REQUEST },
    idFormat: { code: 'invalid_data', message: 'Wrong sale ID format', status: UNPROC },
  };
  if (id.length !== len || !(await findById(id))) {
    let err = {};
    if (req.method === 'DELETE') err = errors.idFormat;
    else err = errors.notFound;
    return res.status(err.status).json({
      err: {
        code: err.code,
        message: err.message,
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
