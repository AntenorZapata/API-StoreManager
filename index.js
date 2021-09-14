const express = require('express');
const productsRouter = require('./routes/productsRoutes');
const salesRouter = require('./routes/salesRouter');
const { handleError } = require('./middlewares/globalErrors');

const app = express();

// Body Parser
app.use(express.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.use('/products', productsRouter);
app.use('/sales', salesRouter);

app.use((err, req, res, _next) => {
  handleError(err, res);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});
