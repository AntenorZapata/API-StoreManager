const { MongoClient } = require('mongodb');

const connection = () => {
  return MongoClient.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((conn) => conn.db(process.env.DATABASE))
    .catch((err) => {
      console.log(err);
      process.exit();
    });
};

module.exports = connection;
