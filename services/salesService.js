const {
  createSaleData,
  getAllSalesData,
  findById,
  updateSaleData,
  removeSaleData,
} = require('../models/saleModel');

const {getProdById} = require('../models/productModel');

const createSale = async (body) => {
  // const {productId, quantity} = body[0];

  // const prod = await getProdById(productId);


  // if (quantity > +prod.quantity) {
  //   return {
  //     err: {
  //       code: 'stock_problem',
  //       message: 'Such amount is not permitted to sell',
  //     },
  //   };
  // } else {
  const sale = await createSaleData(body);
  return sale;
  // }


};

const getAllSales = async () => {
  const sales = await getAllSalesData();
  return sales;
};

const findSaleById = async (id) => {
  const sale = await findById(id);
  return sale;
};

const updateSale = async (id, productId, quantity) => {
  const sale = await updateSaleData(id, productId, quantity);
  return sale;
};

const removeSale = async (id) => {
  const sale = await removeSaleData(id);
  return sale;
};

module.exports = {
  createSale,
  getAllSales,
  findSaleById,
  updateSale,
  removeSale,
};
