const { expect } = require('chai');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { createProduct } = require('../../models/productModel');

describe('Create new product', () => {
  describe('should return invalid data', async () => {
    const payLoad = {};
    const respose = await createProduct(payLoad);

    expect(respose.status).to.be.equal('invalid data');
  });
});
