const connection = require('./connection');
const { ObjectId } = require('mongodb');

const createSaleData = async (bodySales) => {
  const { insertedId } = await connection().then((db) =>
    db.collection('sales').insertOne({ itensSold: bodySales }),
  );

  return {
    _id: insertedId,
    itensSold: bodySales,
  };
};

const getAllSalesData = async () => {
  const allSales = await connection()
    .then((db) => db.collection('sales').find().toArray());

  return {
    sales: allSales,
  };
};

const findById = async (id) => {
  const sale = await connection()
    .then((db) => db.collection('sales').findOne(ObjectId(id)))
    .then((result) => result);

  return sale;
};

module.exports = {
  createSaleData,
  getAllSalesData,
  findById
};