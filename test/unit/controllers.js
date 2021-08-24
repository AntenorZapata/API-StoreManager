const { expect } = require('chai');
const sinon = require('sinon');

const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { getAll, create } = require('../../controllers/productsController');

describe('When calling the create controller', () => {
  describe('Should returns a bad request', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {};

      response.status = sinon.stub().returns(response);
      response.send = sinon.stub().returns();
    });

    it('should returns 422 statusCode', async () => {
      await create(request, response);

      expect(response.status.calledWith(422)).to.be.equal(true);
    });

    it('Should return "Dados inválidos"', async () => {
      await create(request, response);

      expect(response.send.calledWith('Dados inválidos')).to.be.equal(true);
    });
  });

  describe('when you are successful', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {
        name: 'Example Product',
        quantity: 300,
      };

      response.status = sinon.stub().returns(response);
      response.send = sinon.stub().returns();
    });

    it('é chamado o status com o código 201', async () => {
      await create(request, response);

      expect(response.status.calledWith(201)).to.be.equal(true);
    });

    it('é chamado o send com a mensagem "Filme criado com sucesso!"', async () => {
      await create(request, response);
      expect(response.send.calledWith('Filme criado com sucesso!')).to.be.equal(true);
    });
  });
});

describe('When calling the getById controller', () => {
  describe('Should returns a bad request', () => {
    const response = {};
    const request = {};

    before(() => {
      request.params = {};

      response.status = sinon.stub().returns(response);
      response.send = sinon.stub().returns();
    });

    it('should returns 422 statusCode', async () => {
      await getAll(request, response);

      expect(response.status.calledWith(422)).to.be.equal(true);
    });

    it('Should return "Dados inválidos"', async () => {
      await getAll(request, response);

      expect(response.send.calledWith('Dados inválidos')).to.be.equal(true);
    });
  });

  describe('when you are successful', () => {
    const response = {};
    const request = {};

    before(() => {
      request.body = {
        name: 'Example Product',
        quantity: 300,
      };

      response.status = sinon.stub().returns(response);
      response.send = sinon.stub().returns();
    });

    it('é chamado o status com o código 201', async () => {
      await getAll(request, response);

      expect(response.status.calledWith(201)).to.be.equal(true);
    });

    it('é chamado o send com a mensagem "Filme criado com sucesso!"', async () => {
      await getAll(request, response);
      expect(response.send.calledWith('Filme criado com sucesso!')).to.be.equal(true);
    });
  });
});
