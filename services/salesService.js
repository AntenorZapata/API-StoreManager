const {createSaleData} = require('../models/saleModel');

const createSale = async (body) => {
  const sales = await createSaleData(body);
  return sales;
};


module.exports = {
  createSale
};
