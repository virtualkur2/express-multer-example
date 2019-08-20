const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: 'This genre already exists!',
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Genre', GenreSchema);
