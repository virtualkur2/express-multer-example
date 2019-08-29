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
  updatedAt: [{
    date: {
      type: Date
    },
    by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }]
});

GenreSchema.methods = {
  getInfo: function() {
    const _id = this._id;
    const name = this.name;
    return {_id, name}
  }
}

module.exports = mongoose.model('Genre', GenreSchema);
