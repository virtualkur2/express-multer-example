const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const secret = require('../../config').secret;

const tokenMaxAge = 60*60; // Token expiration time is expressed on seconds

const controller = {
  signin: (req, res, next) => {
    if(!req.body.email || !req.body.password) {
      const err = new TypeError('Email and Password required!');
      err.httpStatusCode = 400;
      return next(err);
    }
    User.findOne({email: req.body.email}, async (err, user) => {
      if(err) {
        err.httpStatusCode = 500;
        return next(err);
      }
      if(!user) {
        const err = new Error('User not found!');
        err.httpStatusCode = 400;
        return next(err);
      }
      try {
        const authenticated = await user.authenticate(req.body.password);
        if(!authenticated) {
          const err = new Error('User and Password don\'t match!');
          return next(err);
        }
        const expiresIn = Date.now() + tokenMaxAge;
        const token = jwt.sign({ _id: user._id, exp: expiresIn }, secret);
        return res.status(200).json({
          token,
          user: user.getInfo()
        });
      } catch(e) {
        e.httpStatusCode = 500;
        return next(e);
      }
    });
  },
  requireSignin: (req, res, next) => {
    const token = getToken(req);
    if(!token) {
      const error = new Error('Missing credentials, please login!');
      error.httpStatusCode = 401;
      return next(error);
    }
    jwt.verify(token, secret, { maxAge: tokenMaxAge}, (err, decoded) => {
      if(err) {
        err.httpStatusCode = 500;
        return next(err);
      }
      req.auth = decoded;
      next();
    });
  },
  hasAuthorization: (req, res, next) => {
    const authorized = req.profile && req.auth && (req.profile._id.toString() === req.auth._id);
    if(!authorized) {
      const error = new Error('User not authorized!');
      error.httpStatusCode = 401;
      return next(error);
    }
    next();
  }
}

// The next function implements two ways of deal with token sended by client
// 1.- Token as an URL parameter
// 2.- Token as a Bearer Authorization Header
const getToken = (req) => {
  if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  if(req.query && req.query.token) {
    return req.query.token;
  }
  console.log('No token provided');
  return;
}

module.exports = controller;
