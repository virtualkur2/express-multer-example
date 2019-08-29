const mongoose = require('mongoose');
const Genre = require('./genre.model');
const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: '\'Title\' is required',
    trim: true,
    minLength: 1,
    maxLength: 255,
    unique: 'This movie already exists',
    index: true,
    lowercase: true
  },
  genres: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Genre'
  }
  ],
  image: {
    type: String,
    lowercase: true,
    default: 'movie.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: '\'UserID\' field is required for movie create process'
  },
  updatedAt: [{
    date: {
      type: Date
    },
    by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: '\'UserID\' field is required for movie update process'
    }
  }]
});

MovieSchema.methods = {
  getInfo: function() {
    const _id = this._id;
    const title = this.title;
    const image = this.image;
    const genres = this.genres;
    const info = { _id, title, image, genres }
    return info;
  }
}

module.exports = mongoose.model('Movie', MovieSchema);
