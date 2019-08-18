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
    return new Promise((resolve, reject) => {
      
    });
  }
}
