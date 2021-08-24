const { expect } = require('chai');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { ObjectId } = require('mongodb');
const { createProd, getAllProds } = require('../../models/productModel');
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
  });

  describe('should return all products', () => {
    it('should return an array', async () => {
      const response = await getAllProds();
      expect(response).to.be.an('array');
    });

    it('should return an array with length of 1', async () => {
      const payLoad = { name: 'tv', quantity: 100 };
      await createProd(payLoad.name, payLoad.quantity);
      const response = await getAllProds();
      expect(response.length).to.be.equal(1);
    });
  });
});
