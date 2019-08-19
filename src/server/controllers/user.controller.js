const User = require('../models/user.model');

const controller = {
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
    
  }
}
