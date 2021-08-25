const ProducSchema = require('../schemas/ProductSchema');


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
  const {id} = req.params;

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

module.exports = {
  validateProduct,
  validateProductId,

};
