const express = require('express');

const router = express.Router();

const server = () => {
  // Creating and configuring app
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  //Enabling CORS for development with '*'
  app.use((req, res, next) => {
    res.set({
      'Access-Control-Allow-Origin': '*', // <= This is not secure, use it only in developmnet
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });
  });
  
  return app;
}

module.exports = server;
