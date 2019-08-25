const express = require('express');
const config = require('../config');
const routes = require('./routes');

const router = express.Router();

const server = () => {
  // Creating and configuring app

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  // Header protection
  app.use((req, res, next) => {
    let csp = "default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';";
    res.setHeader('Content-Security-Policy', csp);
    res.removeHeader('X-Powered-By');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Frame-Options', 'sameorigin');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'master-only');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    //********************************************************************
    // next piece of code was taken and adapted from:
    // https://github.com/helmetjs/x-xss-protection/blob/master/index.ts
    const matches = /msie\s*(\d+)/i.exec(req.headers['user-agent'] || '');
    if(!matches || parseFloat(matches[1]) >= 9) {
      res.setHeader('X-XSS-Protection', '1; mode=block');
    } else {
      res.setHeader('X-XSS-Protection', '0');
    }
    //********************************************************************
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('X-Content-Type-Options', 'nosniff');
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

  app.use(express.static(__dirname + '/public'));

  app.use(routes(router));

  return app;
}

module.exports = server;
