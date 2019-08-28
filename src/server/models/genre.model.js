const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: 'This genre already exists!',
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 50
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    date: {
      type: Date
    },
    by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }
});

module.exports = mongoose.model('Genre', GenreSchema);
