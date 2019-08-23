const multer = require('multer');
const mime = require('mime');
const path = require('path');

const Movie = require('../models/movie.model');

const movieImagesPath = 'src/server/public/images/movies';

const movieImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, movieImagesPath);
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    ext = ext.length > 2 ? ext : '.'.concat(mime.extension(file.mimetype));
    let filename = randomFileName(32).concat(ext);
    cb(null, filename);
  }
});

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new TypeError('Only images are allowed'), false);
  }
  cb(null, true);
}

const randomFileName = (length) => {
  return [...Array(length)].map((element) => (~~(Math.random()*36)).toString(36)).join('');
}

const controller = {
    list: (req, res, next) => {
      // Check validity of limit, 50 documents is a low quantity of documents to fetch
      // but a high quantity for pagination purposes.
      // Indeed, we let the user to specify limit=0, as this mean 'no limit' at all
      // but that's mean no pagination either.

      let limit = (isNaN(parseInt(req.query.limit)) || parseInt(req.query.limit) < 0) ? 0 : (parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit));
      let page = (isNaN(parseInt(req.query.page)) || parseInt(req.query.page) < 0 || !limit) ? 0 : parseInt(req.query.page);
      paginateMovies(page, limit).exec((err, movies) => {
        if(err) {
          console.log(err);
          return next(err);
        }
        Movie.estimatedDocumentCount((err, total) => {
          if(err) {
            console.log(err.message);
            return next(err);
          }
          console.log(total);
          return res.status(200).json({movies, total});
        });
      });
    },
    create: (req, res, next) => {
      let movie = new Movie(req.body);
      if(req.file) {
        movie.image = req.file.filename;
        console.log(req.file);
      }
      return res.status(200).json({ movie });
      // movie.save((err, newMovie) => {
      //   if(err) {
      //     return next(err);
      //   }
      //   return res.status(200).json({
      //     message: 'Successfully created movie!'
      //   });
      // });
    },
    read: (req, res, next) => {

    },
    imageUpload: multer({ storage: movieImageStorage, fileFilter: imageFilter }),
}

const paginateMovies = (pageNumber, nPerPage) => {
  const cursor = Movie.find()
                  .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0 )
                  .limit(nPerPage);
  return cursor;
}

module.exports = controller;
