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

// The password string provided by the user is not stored directly in the user
// document. Instead, it is handled as a virtual field.
// Everytime the field 'password' is found in the body's profile, it will be set here.
// So, if an user change his/her password later (or send the same password again),
// it will be stored here and the field 'hashed_password' is going to be modified.

UserSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.hashed_password = 'Modified: Please hash before save it';
  })
  .get(function() {
    return this._password;
  });

UserSchema.methods = {
  authenticate: async function(password_attempt) {
    try {
      const isAuthenticated = await hashHelper.isPasswordCorrect(password_attempt, this.hashed_password);
      return isAuthenticated;
    }
    catch (err) {
      throw err;
    }
  },
  encryptPassword: async function(password) {
    if (!password) {
      throw new TypeError('Password not valid');
    }
    try {
      const hashedPassword = await hashHelper.hashPassword(password);
      return hashedPassword;
    }
    catch(err) {
      throw err;
    }
  },
  getInfo: function() {
    const _id = this._id;
    const name = this.name;
    const lastname = this.lastname;
    const email = this.email;
    const isAdmin = this.isAdmin;
    const createdAt = this.updatedAt;
    const info = { name, lastname, email, isAdmin, createdAt };
    if(this.updatedAt) {
      info.updatedAt = this.updatedAt;
    }
    return info;
  }
}

// Validation for the password field
UserSchema.path('hashed_password').validate(function(v)	{
	if	(this._password	&&	this._password.length	<	passwordMinLength) {
    this.invalidate('password',	`Password must have at least ${passwordMinLength} characters`);
	}
}, null);

// Create hashed password and store it in the user profile before
// validation, so the validation could do it's job correctly.
// Since encryptPassword() is an async function it will be handled
// with async / await.
UserSchema.pre('validate', async function(next) {
  if (!this.isNew && !this.isModified('hashed_password')) { // check if neccessary to rehash the password
    next();
  } else {
    const password = this.password;
    try {
      this.hashed_password = await this.encryptPassword(password);
      next();
    }
    catch(err) {
      console.log(`Error hashing password for user: ${this.email}`);
      err.httpStatusCode = 500;
      next(err);
    }
  }
});

module.exports = mongoose.model('User', UserSchema);
