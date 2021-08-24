const { expect } = require('chai');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createProduct, getAllProducts, getProductById } = require('../../services/productService');

describe('Insere um novo filme no BD', () => {
  describe('quando o payload informado não é válido', () => {
    const payload = {};

    it('retorna um boolean', async () => {
      const response = await createProduct(payload);

      expect(response).to.be.a('boolean');
    });

    it('o boolean contém "false"', async () => {
      const response = await createProduct(payload);

      expect(response).to.be.equal(false);
    });
  });

  describe('quando é inserido com sucesso', () => {
    const payload = {
      name: 'Example product',
      quantity: 1999,
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

    it('retorna um objeto', async () => {
      const response = await createProduct(payload.name, payload.quantity);
      expect(response).to.be.a('object');
    });

    it('tal objeto possui o "id" do novo filme inserido', async () => {
      const response = await createProduct(payload.name, payload.quantity);

      expect(response).to.have.a.property('_id');
    });
  });
});

describe('get product by id', () => {
  describe('should return one product', async () => {
    const id = '612536aba0de6b452e7d2395';
    const response = await getProductById(id);

    it('should return an object', async () => {
      expect(response).to.be.an('object');
    });

    it('should return a product with all keys', async () => {
      expect(response).to.have.all.keys('_id', 'name', 'quantity');
    });
  });

  describe('should return a bad request', async () => {
    const id = '61252d854d66f915e';
    const response = await getProductById(id);

    it('should return an object', () => {
      expect(response).to.be.an('object');
    });

    it('should return a product with "err" key', () => {
      expect(response).to.have.property('err');
    });

    it('should return a product with "invalid data" code', () => {
      expect(response.err.code).to.be.equal('invalid_data');
    });

    it('should return a "Wrong id format" message', () => {
      expect(response.err.message).to.be.equal('Wrong id format');
    });
  });
});
