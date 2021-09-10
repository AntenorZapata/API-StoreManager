const { MongoClient } = require('mongodb');

let db = null;
const connection = () => {

  return db
    ? Promise.resolve(db)
    : MongoClient.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then((conn) =>  {
        db = conn.db(process.env.DATABASE);
        return db;
      })
      .catch((err) => {
        console.log(err);
        process.exit();
      });
};

module.exports = connection;
