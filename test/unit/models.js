const { expect } = require('chai');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { ObjectId } = require('mongodb');
const { createProd, getAllProds, getProdById } = require('../../models/productModel');
const connection = require('../../models/connection');

describe('products route tests', () => {
  describe('Create a new product', () => {
    describe('should return a product', async () => {
      const payLoad = {
        name: 'Computer',
        quantity: 100,
      };

      before(async () => {
        const DBServer = new MongoMemoryServer();
        const URLMock = await DBServer.getUri();

        const connectionMock = await MongoClient.connect(URLMock, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      const response = await createProd(payLoad);

      it('should return a new product', async () => {
        expect(response).to.have.all.keys('_id', 'name', 'quantity');
      });

      it('the new product is a object', async () => {
        expect(response).to.be.an('object');
      });
    });

    describe('should return a bad request', async () => {
      before(async () => {
        const DBServer = new MongoMemoryServer();
        const URLMock = await DBServer.getUri();

        const connectionMock = await MongoClient.connect(URLMock, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      });

      after(() => {
        MongoClient.connect.restore();
      });

      const payLoad = {name: "tv"};
      const response = await createProd(payLoad)

      it('should return a new object', async () => {
        expect(response).to.have.property('err')
      });


      it('', () => {
        expect(response.err.message).to.be.equal('"\"quantity\" must be a number"')

      })
    });
  });
});

// describe('get all products', () => {
//   describe('should return all products', () => {
//     it('should return an array', async () => {
//       const response = await getAllProds();
//       expect(response).to.be.an('array');
//     });

//     it('should return an array with length of 1', async () => {
//       const payLoad = { name: 'tv', quantity: 100 };
//       await createProd(payLoad.name, payLoad.quantity);
//       const response = await getAllProds();
//       expect(response.length).to.be.equal(1);
//     });
//   });
// });

//   describe('get product by id', () => {
//     describe('should return one product', async () => {
//       const id = '612536aba0de6b452e7d2395';
//       const response = await getProdById(id);

//       it('should return an object', async () => {
//         expect(response).to.be.an('object');
//       });

//       it('should return a product with all keys', async () => {
//         expect(response).to.have.all.keys('_id', 'name', 'quantity');
//       });
//     });

//     describe('should return a bad request', async () => {
//       const id = '61252d854d66f915e';
//       const response = await getProdById(id);

//       it('should return an object', () => {
//         expect(response).to.be.an('object');
//       });

//       it('should return a product with "err" key', () => {
//         expect(response).to.have.property('err');
//       });

//       it('should return a product with "invalid data" code', () => {
//         expect(response.err.code).to.be.equal('invalid_data');
//       });

//       it('should return a "Wrong id format" message', () => {
//         expect(response.err.message).to.be.equal('Wrong id format');
//       });
//     });
//   });
// });
