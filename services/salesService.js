const { createSaleData,
  getAllSalesData,
  findById,
  updateSaleData } = require('../models/saleModel');

const createSale = async (body) => {
  const sales = await createSaleData(body);
  return sales;
};

const getAllSales = async () => {
  const sales = await getAllSalesData();
  return sales;
};

const findSaleById = async (id) => {
  const sales = await findById(id);
  return sales;
};

const updateSale = async (id, productId, quantity) => {
  const sales = await updateSaleData(id, productId, quantity);
  return sales;

};

module.exports = {
  createSale,
  getAllSales,
  findSaleById,
  updateSale
};
