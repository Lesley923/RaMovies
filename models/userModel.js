const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide your username!'],
    unique: [true, 'the username has been used by others'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  email: {
    type: String,
    require: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: {
    type: String,
  },
  registration_data: {
    type: Date,
  },
  follows: {
    type: Array,
  },
  was_followed: {
    type: Array,
  },
});

userSchema.pre('save', async function (next) {
  //only run this function if password  was actully modified
  if (!this.isModified('password')) return next();
  //hash
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined; //only use for sign up
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
