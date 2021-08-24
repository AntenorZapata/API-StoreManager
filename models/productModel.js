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

// const create = async (firstName, middleName, lastName) =>
//   connection()
//     .then((db) => db.collection('authors').insertOne({ firstName, middleName, lastName }))
//     .then(result => getNewAuthor({ id: result.insertedId, firstName, middleName, lastName }));

module.exports = {
  createProd,
  getAllProds
};

// const createMovie = async ({ title, director, releaseYear }) => {
//   const { insertedId } = await connection().then((db) =>
//     db.collection('movies').insertOne({ title, director, releaseYear })
//   );

//   return {
//     id: insertedId,
//     title,
//     director,
//     releaseYear,
//   };
// };
