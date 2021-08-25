const {createSale} = require('../services/salesService');

const create = async (req, res) => {
  const bodySales = req.body;
  const sales = await createSale(bodySales);
  res.status(200).json(sales);
};

module.exports = {
  create
};
