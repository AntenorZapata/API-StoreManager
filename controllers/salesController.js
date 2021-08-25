const {createSale} = require('../services/salesService');

const create = async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await createSale(name, quantity);

  if (product.err) return res.status(BAD_REQUEST).json(product);
  return res.status(STATUS_CREATED_SUCCESS).json({ ...product });
};

module.exports = {
  create
};
