const { expect } = require('chai');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createProduct } = require('../../services/productService');

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
