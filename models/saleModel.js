const connection = require('./connection');



const createSaleData = async (bodySales) => {
  const { insertedId } = await connection().then((db) =>
    db.collection('sales').insertOne({ bodySales }),
  );

  return {
    _id: insertedId,
    itensSold: bodySales
  };
};


module.exports = {
  createSaleData
};
