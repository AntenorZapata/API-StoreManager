const express = require('express');
const productsRouter = require('./routes/productsRoutes');
const salesRouter = require('./routes/salesRouter');


const app = express();

// Body Parser
app.use(express.json());

app.use('/products', productsRouter);
app.use('/sales', salesRouter);


// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

module.exports = app;
