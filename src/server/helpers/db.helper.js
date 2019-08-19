const mongoose = require('mongoose');
const config = require('../../config');

const db = mongoose.connection;
const uri = config.mongouri;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  ssl: config.env !== 'development' ? true: false,
  connectTimeoutMS: 15000,
  reconnectInterval: 800,
  reconnectTries: 5,
  poolSize: 15,
}

const helper = {
  connect: () => {
    return mongoose.connect(uri, options);
  },
  disconnect: () => {
    return new Promise((resolve, reject) => {
      db.close()
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }
}

db.on('connecting', () => {
  console.info('===> Trying to connect to database...');
});

db.on('connected', () => {
  console.info('===> Succesfully connected to database.');
});

db.on('disconnecting', () => {
  console.info('===> Disconnecting from database...');
});

db.on('disconnected', () => {
  console.info('===> Database connection lost.');
});

db.on('close', () => {
  console.info('===> Database connection closed succesfully.');
});

db.on('fullsetup', () => {
  console.info('===> Replica set: Succesfully connected to Primary and at least one Secondary');
});

db.on('all', () => {
  console.info('===> Replica set: Succesfully connected to All servers of the set.');
});

db.on('error', (err) => {
  console.error(`===> Error connecting to database: ${err}`);
});

module.exports = helper;
