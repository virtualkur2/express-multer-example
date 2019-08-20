const express = require('express');
const config = require('../config');

const router = express.Router();

const server = () => {
  // Creating and configuring app
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  // Helmet protection
  app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  //Enabling CORS for development with '*'
  app.use((req, res, next) => {
    if(config.env === 'development') {
      res.set({
        'Access-Control-Allow-Origin': '*', // <= This is not secure, use it only in developmnet
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      });
    }
    next();
  });


  return app;
}

module.exports = server;
