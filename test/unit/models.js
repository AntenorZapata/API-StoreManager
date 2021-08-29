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
} = require('../../models/productModel');

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
});

// describe('products route tests', () => {
//   describe('Create a new product', () => {
//     describe('should return a product', async () => {
//       const payLoad = {
//         name: 'Computer',
//         quantity: 100,
//       };

//       before(async () => {
//         const DBServer = new MongoMemoryServer();
//         const URLMock = await DBServer.getUri();

//         const connectionMock = await MongoClient.connect(URLMock, {
//           useNewUrlParser: true,
//           useUnifiedTopology: true,
//         });

//         sinon.stub(MongoClient, 'connect').resolves(connectionMock);
//       });

//       after(() => {
//         MongoClient.connect.restore();
//       });

//       const response = await createProd(payLoad);

//       it('should return a new product', async () => {
//         expect(response).to.have.all.keys('_id', 'name', 'quantity');
//       });

//       it('the new product is a object', async () => {
//         expect(response).to.be.an('object');
//       });
//     });

//     describe('should return a bad request', async () => {
//       before(async () => {
//         const DBServer = new MongoMemoryServer();
//         const URLMock = await DBServer.getUri();

//         const connectionMock = await MongoClient.connect(URLMock, {
//           useNewUrlParser: true,
//           useUnifiedTopology: true,
//         });

//         sinon.stub(MongoClient, 'connect').resolves(connectionMock);
//       });

//       after(() => {
//         MongoClient.connect.restore();
//       });

//       const payLoad = { name: 'tv' };
//       const response = await createProd(payLoad);

//       it('should return a new object', async () => {
//         expect(response).to.have.property('err');
//       });

//       it('', () => {
//         expect(response.err.message).to.be.equal('""quantity" must be a number"');
//       });
//     });
//   });
// });

// // describe('get all products', () => {
// //   describe('should return all products', () => {
// //     it('should return an array', async () => {
// //       const response = await getAllProds();
// //       expect(response).to.be.an('array');
// //     });

// //     it('should return an array with length of 1', async () => {
// //       const payLoad = { name: 'tv', quantity: 100 };
// //       await createProd(payLoad.name, payLoad.quantity);
// //       const response = await getAllProds();
// //       expect(response.length).to.be.equal(1);
// //     });
// //   });
// // });

// //   describe('get product by id', () => {
// //     describe('should return one product', async () => {
// //       const id = '612536aba0de6b452e7d2395';
// //       const response = await getProdById(id);

// //       it('should return an object', async () => {
// //         expect(response).to.be.an('object');
// //       });

// //       it('should return a product with all keys', async () => {
// //         expect(response).to.have.all.keys('_id', 'name', 'quantity');
// //       });
// //     });

// //     describe('should return a bad request', async () => {
// //       const id = '61252d854d66f915e';
// //       const response = await getProdById(id);

// //       it('should return an object', () => {
// //         expect(response).to.be.an('object');
// //       });

// //       it('should return a product with "err" key', () => {
// //         expect(response).to.have.property('err');
// //       });

// //       it('should return a product with "invalid data" code', () => {
// //         expect(response.err.code).to.be.equal('invalid_data');
// //       });

// //       it('should return a "Wrong id format" message', () => {
// //         expect(response.err.message).to.be.equal('Wrong id format');
// //       });
// //     });
// //   });
// // });
