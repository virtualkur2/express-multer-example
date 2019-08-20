const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 255
  },
  genres: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Genre'
    }
  ],
  image: {
    type: String,
    required: true,
    default: 'movie.jpeg'
  },
  modify: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      },
      description: {
        type: String
      }
    }
  ]
});

module.exports = mongoose.model('Movie', MovieSchema);
