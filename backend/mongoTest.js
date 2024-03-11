const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://admin:admin@127.0.0.1:27017/admin';

const client = new MongoClient(uri);

client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  } else {
    console.log('Connected to MongoDB');
  }

  client.close();
});