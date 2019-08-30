const User = require('../models/user.model');

const controller = {
  list: (req, res, next) => {
    User.find({}, (err, users) => {
      if(err) {
        return next(err);
      }
      if(!users.length) {
        const err = new Error('No users!');
        err.httpStatusCode = 400;
        return next(err);
      }
      return res.status(200).json(users);
    });
  },
  create: (req, res, next) => {
    const user = new User(req.body);
    user.save((err, newUser) => {
      if(err) {
        return next(err);
      }
      return res.status(200).json({
        message: 'Successfully signed up!'
      });
    });
  },
  read: (req, res, next) => {
    return res.status(200).json({
      user: req.profile.getInfo()
    });
  },
  update: (req, res, next) => {
    let user = Object.assign({}, req.profile, req.body);
    user.updatedAt = Date.now();
    user.save((err, result) => {
      if(err) {
        return next(err);
      }
      return res.status(201).json({
        message: 'Succesfully updated!'
      });
    });
  },
  remove: (req, res, next) => {
    let user = req.profile;
    user.remove((err, deletedUser) => {
      if(err) {
        return next(err);
      }
      return res.status(200).json({
        message: 'Successfully deleted!'
      });
    });
  },
  userById: (req, res, next, id) => {
    User.findById(id, (err, user) => {
      if(err) {
        return next(err);
      }
      if(!user) {
        const err = new Error('User not found!');
        err.httpStatusCode = 404;
        return next(err);
      }
      req.profile = user;
      next();
    });
  },
  userByEmail: (req, res, next, email) => {
    User.findOne({email: email}, (err, user) => {
      if(err) {
        return next(err);
      }
      if(!user) {
        const err = new Error('User not found!');
        err.httpStatusCode = 404;
        return next(err);
      }
      req.profile = user;
      next();
    });
  }
}

module.exports = controller;
