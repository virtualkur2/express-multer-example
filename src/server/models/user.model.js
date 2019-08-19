const mongoose = require('mongoose');
const hashHelper = require('../helpers/hash.helper');

const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordMinLength = 8; // Keep it 8 or longer
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Field \'name\' is required',
    lowercase: true
  },
  lastname: {
    type: String,
    trim: true,
    required: 'Field \'lastname\' is required',
    lowercase: true
  },
  email: {
    type: String,
    trim: true,
    unique: 'This email already exists.',
    required: 'Field \'name\' is required',
    match: [emailRegexp,'Please fill a valid email address'],
    lowercase: true,
    index: true
  },
  hashed_password: {
    type: String,
    required: 'Field \'password\' is required',
    minlength: [passwordMinLength, `Password must have at least ${passwordMinLength} characters.`]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});
