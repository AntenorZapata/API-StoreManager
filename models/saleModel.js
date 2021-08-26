const connection = require('./connection');
const { ObjectId } = require('mongodb');
const {updateProdQuantity} = require('./productModel');

const createSaleData = async (bodySales) => {
  const {productId, quantity} = bodySales[0];
  await updateProdQuantity(productId, quantity, 'decrease');

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

const updateSaleData = async (id, productId, quantity) => {

  await connection().then((db) =>
    db
      .collection('sales')
      .updateOne(
        { _id: ObjectId(id) },
        { $set: { 'itensSold.$[item].quantity': quantity } },
        { arrayFilters: [{ 'item.productId': productId }], upsert: true },
      ),
  );

  return {
    _id: id,
    itensSold: [{
      productId,
      quantity,
    }
    ]
  };
};

const removeSaleData = async (id) => {

  const { value } = await connection()
    .then((db) => db.collection('sales').findOneAndDelete({ _id: ObjectId(id) }));

  value.itensSold.forEach((el) => {
    updateProdQuantity(el.productId, el.quantity, 'increase');
  });

  return value;
};

module.exports = {
  createSaleData,
  getAllSalesData,
  findById,
  updateSaleData,
  removeSaleData
};
