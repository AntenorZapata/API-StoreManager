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
  return await connection()
    .then((db) => db.collection('products').find().toArray())
    .then((result) => result);
};

module.exports = {
  createProd,
  getAllProds,
};
