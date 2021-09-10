// const arrBands = [
//   {
//     id: 1,
//     PinkFloyd: [
//       {
//         id: 1,
//         'The Wall': [
//           {
//             id: 1,
//             title: 'Another brick in the wall',
//             year: 1966,
//             guitarrist: 'David Gilmour',
//             guitar: 'Fender Strato',
//             key: 'Em',
//             scale: 'Pentatonic',
//           },
//         ],
//       },
//       {
//         id: 2,
//         'Division Bell': [
//           {
//             id: 1,
//             title: 'Another brick in the wall',
//             year: 1966,
//             guitarrist: 'David Gilmour',
//             guitar: 'Fender Strato',
//             key: 'Em',
//             scale: 'Pentatonic',
//           },
//         ],
//       },
//       {
//         id: 3,
//         Pulse: [
//           {
//             id: 1,
//             title: 'Another brick in the wall',
//             year: 200,
//             guitarrist: 'David Gilmour',
//             guitar: 'Fender Strato',
//             key: 'Em',
//             scale: 'Pentatonic',
//           },
//         ],
//       },
//     ],
//   },
// ];

// console.log(arrBands[0].PinkFloyd[0]['The Wall'][0].title);

// const arr = [];
const { expect } = require('chai');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { ObjectId } = require('mongodb');
const {
  createProd,
  getAllProds,
  getProdById,
  updateProd,
  deleteProduct,
  updateProdQuantity,
} = require('../../models/productModel');

const {
  createSaleData,
  getAllSalesData,
  findById,
  updateSaleData,
  removeSaleData,
} = require('../../models/saleModel');

const VALID_ID_1 = ObjectId('60e770a1f02f7e8cab42588a');
const VALID_ID_2 = ObjectId('60e770a1f02f7e8cab42589a');

const VALID_PRODUCT_INPUT_1_FULL = {
  _id: VALID_ID_1,
  name: 'Lapiseira Graphgear 1000',
  quantity: 100,
};

describe('Product Model Tests', () => {
  let connectionMock;
  const DBServer = new MongoMemoryServer();

  before(async () => {
    const URLMock = await DBServer.getUri();
    connectionMock = await MongoClient.connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
    await DBServer.stop();
  });

  describe('GET Method', () => {
    // // Arrange // Act // Assert
    describe('when DB is empty', () => {
      it('should return an array', async () => {
        const response = await getAllProds();
        expect(response.products).to.be.an('array');
      });

      it('should return an empty array', async () => {
        const response = await getAllProds();
        expect(response.products).to.be.empty;
      });
    });

    describe('when DB has at least one item', () => {
      before(async () => {
        await connectionMock
          .db('StoreManager')
          .collection('products')
          .insertOne({ name: 'Computer', quantity: 2 });
      });

      after(async () => {
        await connectionMock.db('StoreManager').collection('products').deleteMany({});
      });

      it('should return an object', async () => {
        const result = await getAllProds();
        expect(result).to.be.an('object');
      });

      it('should return an object with the products property', async () => {
        const response = await getAllProds();
        expect(response.products).to.be.an('array');
      });

      it('should return an array with items of type object', async () => {
        const response = await getAllProds();
        expect(response.products[0]).to.be.an('object');
      });

      it('the array objects must have id, name and quantity properties.', async () => {
        const db = connectionMock.db('StoreManager');
        await db.collection('products').insertOne({ name: 'Tv', quantity: 2 });
        await db.collection('products').insertOne({ name: 'Computer', quantity: 20 });
        const result = await getAllProds();

        expect(result.products.length).to.be.equal(2);
      });
    });

    describe('GET product by ID', () => {
      it('should return an product', async () => {
        const db = connectionMock.db('StoreManager');
        await db
          .collection('products')
          .insertOne({ _id: ObjectId('612c16491910a4dc21c7f134'), name: 'Tv', quantity: 2 });
        const res = await getProdById(ObjectId('612c16491910a4dc21c7f134'));

        expect(res).to.be.an('object');
        expect(res.name).to.be.equal('Tv');
        expect(res.quantity).to.be.equal(2);
        expect(res).to.have.all.keys('_id', 'name', 'quantity');
      });
    });
  });

  describe('POST method tests', () => {
    describe('When is a bad request', () => {
      after(async () => {
        await connectionMock.db('StoreManager').collection('products').deleteMany({});
      });
      it('should return an object', async () => {
        const res = await createProd({ name: 'borracha', quantity: '' });
        expect(res).to.be.an('object');
      });
      it('should return an object with the err property', async () => {
        const res = await createProd({ name: 'borracha', quantity: '' });
        expect(res).to.haveOwnProperty('err');
      });
      it('should return an err property with the code equal to "invalid_data"', async () => {
        const res = await createProd({ name: 'borracha', quantity: '' });
        expect(res.err.code).to.be.equal('invalid_data');
      });
      it('should return an err property with the message equal to "quantity must be a number"', async () => {
        const res = await createProd({ name: 'borracha', quantity: '' });
        expect(res.err.message).to.be.equal('quantity must be a number');
      });
    });
  });

  describe('on success', () => {
    it('should return a new product', async () => {
      it('should return an object', async () => {
        const res = await createProd({ name: 'borracha', quantity: 2 });
        expect(res).to.be.an('object');
      });

      it('should return an object with the properties _id, name and quantity', async () => {
        const res = await createProd({ name: 'borracha', quantity: 2 });
        expect(res).to.have.all.keys('_id', 'name', 'quantity');
      });
    });
  });

  describe('DELETE method', () => {
    describe('on success', async () => {
      before(async () => {
        const db = connectionMock.db('StoreManager');
        await db
          .collection('products')
          .insertOne({ _id: ObjectId('612c16491910a4dc21c7f134'), name: 'Tv', quantity: 2 });
      });

      it('should return a product', async () => {
        const res = await deleteProduct(ObjectId('612c16491910a4dc21c7f134'));
        expect(res).to.be.an('object');
      });

      it('should return an object with the properties _id, name and quantity', async () => {
        const res = await deleteProduct(ObjectId('612c16491910a4dc21c7f134'));
        expect(res).to.have.all.keys('_id', 'name', 'quantity');
        expect(res.name).to.be.equal('Tv');
        expect(res.quantity).to.be.equal(2);
      });

      it('should return an array with length equal to zero', async () => {
        await deleteProduct(ObjectId('612c16491910a4dc21c7f134'));
        const res = await getAllProds();
        expect(res.products.length).to.be.equal(0);
      });
    });

    describe('bad request', () => {
      before(async () => {
        const db = connectionMock.db('StoreManager');
        await db
          .collection('products')
          .insertOne({ _id: ObjectId('612c16491910a4dc21c7f134'), name: 'Tv', quantity: 2 });
      });

      it('should return an object with the err property', async () => {
        const res = await deleteProduct(ObjectId('612c16491910a4dc21c7f134'));
        expect(res).to.haveOwnProperty('err');
      });
      it('should return an err property with the code equal to "invalid_data"', async () => {
        const res = await deleteProduct(ObjectId('612c16491910a4dc21c7f134'));
        expect(res.err.code).to.be.equal('invalid_data');
      });
      it('should return an err property with the message equal to "quantity must be a number"', async () => {
        const res = await deleteProduct(ObjectId('612c16491910a4dc21c7f134'));
        expect(res.err.message).to.be.equal('Wrong id format');
      });
    });
  });

  describe('PUT Method', () => {
    it('should return an object', async () => {
      after(async () => {
        await connectionMock.db('StoreManager').collection('products').deleteMany({});
      });

      const res = await updateProd({
        _id: ObjectId('612c16491910a4dc21c7f134'),
        name: 'Car',
        quantity: 20,
      });

      expect(res.name).to.be.equal('Tv');
      expect(res.quantity).to.be.equal(2);
    });
  });

  describe('test update quantity', async () => {
    await db
      .collection('products')
      .insertOne({ _id: ObjectId('612c16491910a4dc21c7f134'), name: 'Tv', quantity: 2 });

    await updateProdQuantity('612c16491910a4dc21c7f134', 1, 'decrease');
    const productUpdated = await getProdById('612c16491910a4dc21c7f134');

    expect(productUpdated.quantity).to.be.equal(1);
    expect(productUpdated).to.be.an('object');
  });
});

describe('Product Model Tests', () => {
  let connectionMock;
  const DBServer = new MongoMemoryServer();

  before(async () => {
    const URLMock = await DBServer.getUri();
    connectionMock = await MongoClient.connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(async () => {
    MongoClient.connect.restore();
    await DBServer.stop();
  });

  describe('GET Method', () => {
    // // Arrange // Act // Assert
    describe('when DB is empty', () => {
      it('should return an array', async () => {
        const response = await getAllSalesData();
        expect(response.sales).to.be.an('array');
      });

      it('should return an empty array', async () => {
        const response = await getAllSalesData();
        expect(response.sales).to.be.empty;
      });
    });

    describe('when DB has at least one item', () => {
      before(async () => {
        await db
          .collection('products')
          .insertOne({ _id: ObjectId('612c16491910a4dc21c7f134'), name: 'Tv', quantity: 2 });

        await connectionMock
          .db('StoreManager')
          .collection('sales')
          .insertOne({
            _id: '60e770a1f02f7e8cab42588a',
            itensSold: [{ productId: '612c16491910a4dc21c7f134', quantity: 1 }],
          });
      });
      after(async () => {
        await connectionMock.db('StoreManager').collection('sales').deleteMany({});
        await connectionMock.db('StoreManager').collection('products').deleteMany({});
      });

      it('should return an object', async () => {
        const result = await getAllSalesData();
        expect(result).to.be.an('object');
      });

      it('should return an object with the itensSold property', async () => {
        const response = await getAllSalesData();
        expect(response.itensSold).to.be.an('array');
      });

      it('the itensSold array must have an object.', async () => {
        const response = await getAllSalesData();
        expect(response.itensSold[0]).to.be.an('object');
      });

      it('the itensSold array must have length of 1', async () => {
        const response = await getAllSalesData();
        expect(response.itensSold.length).to.be.equal(1);
      });
    });

    describe('GET sale by ID', () => {
      it('should return a sale', async () => {
        before(async () => {
          await db
            .collection('products')
            .insertOne({ _id: ObjectId('612c16491910a4dc21c7f134'), name: 'Tv', quantity: 2 });

          await connectionMock
            .db('StoreManager')
            .collection('sales')
            .insertOne({
              _id: '60e770a1f02f7e8cab42588a',
              itensSold: [{ productId: '612c16491910a4dc21c7f134', quantity: 1 }],
            });
        });

        const response = await findById('60e770a1f02f7e8cab42588a');
        expect(response).to.be.an('object');
        expect(response.itensSold).to.be.an('array');
        expect(response.itensSold[0].quantity).to.be.equal(1);
        expect(response).to.have.all.keys('_id', 'itenSold');
      });
    });

    describe('POST method tests', () => {
      describe('When is a bad request', async () => {
        before(async () => {
          await db
            .collection('products')
            .insertOne({ _id: ObjectId('612c16491910a4dc21c7f134'), name: 'Tv', quantity: 2 });
        });

        after(async () => {
          await connectionMock.db('StoreManager').collection('sales').deleteMany({});
        });

        it('should return an object', async () => {
          const res = await createSaleData({
            _id: '60e770a1f02f7e8cab42588a',
            itensSold: [{ productId: '612c16491910a4dc21c7f134', quantity: 1 }],
          });
          expect(res).to.be.an('object');
          expect(res.err).to.have.all.keys('code', 'message');
        });

        it('should return an object with the err property', async () => {
          const res = await createSaleData({
            _id: '60e770a1f02f7e8cab42588a',
            itensSold: [{ productId: '612c16491910a4dc21c7f134', quantity: 10 }],
          });
          expect(res).to.haveOwnProperty('err');
        });
        it('should return an err property with the code equal to "stock_problem"', async () => {
          const res = await createSaleData({
            _id: '60e770a1f02f7e8cab42588a',
            itensSold: [{ productId: '612c16491910a4dc21c7f134', quantity: 10 }],
          });
          expect(res.err.code).to.be.equal('stock_problem');
        });
        it('should return an err property with the message equal to "Such amount is not permitted to sell"', async () => {
          const res = await createSaleData({
            _id: '60e770a1f02f7e8cab42588a',
            itensSold: [{ productId: '612c16491910a4dc21c7f134', quantity: 10 }],
          });
          expect(res.err.message).to.be.equal('Such amount is not permitted to sell');
        });
      });
    });

    describe('on success', () => {
      it('should return a new sale', async () => {
        it('should return an object', async () => {
          const res = await createSaleData({
            _id: '60e770a1f02f7e8cab42588a',
            itensSold: [{ productId: '612c16491910a4dc21c7f134', quantity: 1 }],
          });
          expect(res).to.be.an('object');
        });

        it('should return an object with the properties _id, name and quantity', async () => {
          const res = await createSaleData({
            _id: '60e770a1f02f7e8cab42588a',
            itensSold: [{ productId: '612c16491910a4dc21c7f134', quantity: 1 }],
          });
          expect(res).to.have.all.keys('_id', 'itenSold');
        });
      });
    });

    describe('DELETE method', () => {
      describe('on success', async () => {
        before(async () => {
          await connectionMock
            .db('StoreManager')
            .collection('sales')
            .insertOne({
              _id: '60e770a1f02f7e8cab42588a',
              itensSold: [{ productId: '612c16491910a4dc21c7f134', quantity: 1 }],
            });
        });
        it('should return a product', async () => {
          const result = await removeSaleData('60e770a1f02f7e8cab42588a');
          expect(res).to.be.an('object');
        });

        it('should return an object with the properties _id and itenSold', async () => {
          const result = await removeSaleData('60e770a1f02f7e8cab42588a');
          expect(result).to.have.all.keys('_id', 'itenSold');
          expect(result.itensSold).to.be.an('array');
          expect(result.insertOne[0]).to.have.all.keys('productId', 'quantity');
        });

        it('should return an array with length equal to zero', async () => {
          await removeSaleData('60e770a1f02f7e8cab42588a');
          const res = await getAllSalesData();
          expect(res.sales.length).to.be.equal(0);
        });
      });
    });

    describe('Em caso de sucesso', () => {
      it('deve retornar um 1 quando conseguir fazer um update', async () => {
        const db = connectionMock.db('StoreManager');
        await db.collection('sales').insertOne({
          _id: '60e770a1f02f7e8cab42588a',
          itensSold: [{ productId: '612c16491910a4dc21c7f134', quantity: 1 }],
        });
        const id = '612c16491910a4dc21c7f134';
        // const itensSold = [{ id, quantity: 3 }];
        const result = await updateSaleData('60e770a1f02f7e8cab42588a', id, 4);
        expect(result).to.be.an('object');
        expect(result).to.have.all.keys('_id', 'itenSold');
      });
    });
  });
});
// Sales Model

//   //   describe('bad request', () => {
//   //     before(async () => {
//   //       const db = connectionMock.db('StoreManager');
//   //       await db
//   //         .collection('products')
//   //         .insertOne({ _id: ObjectId('612c16491910a4dc21c7f134'), name: 'Tv', quantity: 2 });
//   //     });

//   //     it('should return an object with the err property', async () => {
//   //       const res = await deleteProduct(ObjectId('612c16491910a4dc21c7f134'));
//   //       expect(res).to.haveOwnProperty('err');
//   //     });
//   //     it('should return an err property with the code equal to "invalid_data"', async () => {
//   //       const res = await deleteProduct(ObjectId('612c16491910a4dc21c7f134'));
//   //       expect(res.err.code).to.be.equal('invalid_data');
//   //     });
//   //     it('should return an err property with the message equal to "quantity must be a number"', async () => {
//   //       const res = await deleteProduct(ObjectId('612c16491910a4dc21c7f134'));
//   //       expect(res.err.message).to.be.equal('Wrong id format');
//   //     });
//   //   });
//   // });
// });
