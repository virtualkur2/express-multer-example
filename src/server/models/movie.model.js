const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 255,
    unique: 'This movie already exists',
    index: true,
    lowercase: true
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
    lowercase: true,
    default: 'movie.jpeg'
  },
  createdAt: {
    date: {
      type: Date,
      default: Date.now
    },
    by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  updatedAt: [{
    date: {
      type: Date
    },
    by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    desc: {
      type: String,
      trim: true,
      lowercase: true
    }
  }]
});

MovieSchema.methods = {
  getInfo: function() {
    const _id = this._id;
    const title = this.title;
    const image = this.image;
    const info = { _id, title, image }
    return info;
  }
}

module.exports = mongoose.model('Movie', MovieSchema);
