// const { ObjectId } = require('mongodb');
const express = require('express');
const productsRouter = require('./routes/productsRoutes');

const app = express();

// Body Parser
app.use(express.json());

app.use('/products', productsRouter);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

module.exports = app;
