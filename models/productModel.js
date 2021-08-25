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

const updateProd = async (id, name, quantity) => {
  const { insertedId } = await connection().then((db) =>
    db.collection('products').updateOne({ _id: ObjectId(id) },
      { $set: { name, quantity } }),
  );

  return {
    _id: insertedId,
    name,
    quantity
  };
};

const getProdById = async (id) => {
  const product = await connection()
    .then((db) => db.collection('products').findOne(ObjectId(id)))
    .then((result) => result);

  return product;
};

const deleteProduct = async (id) => {
  const { value } = await connection()
    .then((db) => db.collection('products').findOneAndDelete({ _id: ObjectId(id) }));

  return value;
};

module.exports = {
  createProd,
  getAllProds,
  getProdById,
  updateProd,
  deleteProduct
};
