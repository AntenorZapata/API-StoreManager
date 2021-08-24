const connection = require('./connection');
const { ObjectId } = require('mongodb');

const createProd = async (name, quantity) => {
  const { insertedId } = await connection().then((db) =>
    db.collection('products').insertOne({ name, quantity }),
  );

  return {
    _id: insertedId,
    name,
    quantity,
  };
};

const getAllProds = async () => {
  const result = await connection()
    .then((db) => db.collection('products').find().toArray())
    .then((result) => result);

  return {
    products: result,
  };
};

const getProdById = async (id) => {
  const response = await getAllProds();
  const product = response.products.find((el) => el._id.equals(id));
  return product;
};

module.exports = {
  createProd,
  getAllProds,
  getProdById,
};
