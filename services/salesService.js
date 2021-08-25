const { createSaleData, getAllSalesData, findById } = require('../models/saleModel');

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

module.exports = {
  createSale,
  getAllSales,
  findSaleById
};
