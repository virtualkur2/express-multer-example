const Genre = require('../models/genre.model');

const controller = {
  list: (req, res, next) => {
    Genre.find().exec((err, genres) => {
      if(err) {
        console.log(err.message);
        return next(err);
      }
      if(!genres.length) {
        const err = new Error('No Genres found.');
        err.httpStatusCode = 404;
        return next(err);
      }
      let result = genres.map((genre) => {
        return genre.getInfo();
      });
      return res.status(200).json(result);
    });
  },
  create: (req, res, next) => {
    let genre = new Genre(req.body);
    genre.save((err, newGenre) => {
      if(err) {
        console.log(err.message);
        return next(err);
      }
      return res.status(200).json({
        message: 'Genre succesfully created.'
      });
    });
  },
  read: (req, res, next) => {
    if(req.genres) {
      let genres = req.genres.map((genre) => {
        return genre.getInfo();
      });
      return res.status(200).json(genres);
    }
    let genre = req.genre.getInfo();
    return res.status(200).json(genre);
  },
  remove: (req, res, next) => {
    let genre = req.genre;
    genre.remove((err, deletedGenre) => {
      if(err) {
        return next(err);
      }
      return res.status(200).json({
        message: 'Succesfully deleted genre.'
      });
    });
  },
  update: (req, res, next) => {
    let genre = req.genre;
    genre.name = req.body.name || genre.name;
    if(!genre.updatedAt) {
      genre.updatedAt = [];
    }
    genre.updatedAt.push({
      date: Date.now(),
      by: '5d66221a11ca9709a9539985'
    });
  },
  genreById: (req, res, next, id) => {
    Genre.findById(id).exec((err, genre) => {
      if(err) {
        return next(err);
      }
      if(!genre) {
        const err = new Error('Genre not found!');
        err.httpStatusCode = 404;
        return next(err);
      }
      req.genre = genre;
      next();
    });
  },
  genreByName: (req, res, next, name) => {
    let nameRegExp = new RegExp(name, 'i');
    Genre.find({name: nameRegExp}).exec((err, genres) => {
      if(err) {
        return next(err);
      }
      if(!genres.length) {
        const err = new Error('Genre not found!');
        err.httpStatusCode = 404;
        return next(err);
      }
      req.genres = genres;
      next();
    });
  }
}



module.exports = controller;
