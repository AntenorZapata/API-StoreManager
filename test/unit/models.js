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

const {
  createSaleData,
  getAllSalesData,
  findById,
  updateSaleData,
  removeSaleData,
} = require('../../models/saleModel');

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
});

// Sales Model
