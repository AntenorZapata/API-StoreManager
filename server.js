const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./index');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});
